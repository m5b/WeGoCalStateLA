// Fills the DEMO database with fake data for showing the site to the dean.
// The content itself lives in demoData.mjs -- edit that file to change it.
//
// Run it through scripts/demo-db.sh ("seed"). It refuses to run unless the
// database name ends in "_demo", so it can't touch the real one. Re-running
// wipes the demo content (posts, replies, events, demo users and the demo
// FAQs) and loads it fresh, with dates relative to today so events stay
// upcoming.
import { randomUUID } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { USERS, POSTS, EVENTS, FAQS } from './demoData.mjs'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const IMAGE_DIR = path.resolve(HERE, '../demo/images')
const TEAM_USERNAME = 'WeGo Community Team'
const PHOTO_URL_PREFIX = '/api/uploads/demo/'

// Same rule the login form enforces, so demo accounts can actually sign in.
const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,21}$/

// conn: a mysql2 connection (promise API). hashPassword(plain) -> hash.
export async function seedDemo({ conn, hashPassword, password, deanPassword = password, imageDir = IMAGE_DIR, uploadDir, now = new Date(), log = console.log }) {
    if (!PASSWORD_RULE.test(password || '')) {
        throw new Error('DEMO_PASSWORD must be 8-21 characters with upper, lower, digit, and one of @$!%*?& (same rule as the login form).')
    }
    if (!PASSWORD_RULE.test(deanPassword || '')) {
        throw new Error('DEAN_PASSWORD must be 8-21 characters with upper, lower, digit, and one of @$!%*?& (same rule as the login form).')
    }

    const ago = ([days, hours]) => new Date(now.getTime() - (days * 24 + hours) * 3600 * 1000)
    const startsIn = (days, hour, minute) => {
        const d = new Date(now.getTime())
        d.setDate(d.getDate() + days)
        d.setHours(hour, minute, 0, 0)
        return d
    }
    const [[dbRow]] = await conn.execute('SELECT DATABASE() AS name')
    log(`Seeding database: ${dbRow.name}`)

    // What this copy of the schema supports.
    const hasColumn = async (table, column) => {
        const [rows] = await conn.execute(
            'SELECT COUNT(*) AS n FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = ? AND column_name = ?',
            [table, column]
        )
        return Number(rows[0].n) > 0
    }
    const threadPhotos = await hasColumn('threads', 'photo_url')
    const commentPhotos = await hasColumn('comments', 'photo_url')
    const [[nullRow]] = await conn.execute(
        "SELECT is_nullable AS nullable FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'comments' AND column_name = 'user_id'"
    )
    const anonymousOk = nullRow && nullRow.nullable === 'YES'
    if (!threadPhotos) log('Note: the post photo column was not found, so posts show only the event pictures. Run the migrations to add post pictures.')
    if (!commentPhotos) log('Note: replies cannot carry pictures yet, so the two replies with pictures are added without them.')
    if (!anonymousOk) log('Note: anonymous posting columns not found, so anonymous posts/replies are skipped.')

    // Make the sample pictures available to the API (served from /api/uploads).
    let available = new Set()
    try {
        available = new Set((await fs.readdir(imageDir)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)))
    } catch {
        log(`No sample images found in ${imageDir}; photos will be left out.`)
    }
    if (available.size && uploadDir) {
        await fs.mkdir(path.join(uploadDir, 'demo'), { recursive: true })
        for (const file of available) await fs.copyFile(path.join(imageDir, file), path.join(uploadDir, 'demo', file))
    }
    const photoUrl = (file) => {
        if (!file) return null
        if (!available.has(file)) {
            log(`Missing image ${file}; leaving that photo out.`)
            return null
        }
        return PHOTO_URL_PREFIX + file
    }

    await conn.beginTransaction()
    try {
        // ---- wipe previous demo content (this database only) ----
        for (const table of ['comment_reactions', 'thread_reactions', 'comment_reports', 'thread_reports']) {
            await conn.execute(`DELETE FROM ${table}`)
        }
        await conn.execute('DELETE FROM comments')
        await conn.execute('DELETE FROM events')
        await conn.execute("DELETE FROM threads WHERE category <> 'faq'")
        // Only the FAQs this script added (matched by question); the migration's FAQs stay.
        await conn.execute(
            `DELETE FROM threads WHERE category = 'faq' AND title IN (${FAQS.map(() => '?').join(', ')})`,
            FAQS.map((f) => f.title)
        )
        // The demo people are found by name (plus any left over from older seeds, which used a demo_ prefix).
        await conn.execute(
            `DELETE FROM users WHERE username LIKE 'demo\\_%' OR username IN (${USERS.map(() => '?').join(', ')})`,
            USERS.map((u) => u.username)
        )

        // ---- users ----
        const passwordHash = await hashPassword(password)
        const deanHash = deanPassword === password ? passwordHash : await hashPassword(deanPassword)
        const userIds = {}
        for (const u of USERS) {
            const stamp = ago([40, 0])
            const [res] = await conn.execute(
                'INSERT INTO users (username, alias, relationship, interests, password_hash, is_admin, user_uuid, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, UUID_TO_BIN(?), ?, ?)',
                [u.username, u.alias, u.relationship, u.interests, u.isDean ? deanHash : passwordHash, u.isAdmin ? 1 : 0, randomUUID(), stamp, stamp]
            )
            userIds[u.username] = res.insertId
        }
        // The login-less team account (created by the FAQ migration); make it if missing.
        const [teamRows] = await conn.execute('SELECT user_id FROM users WHERE username = ?', [TEAM_USERNAME])
        if (teamRows.length) {
            userIds.team = teamRows[0].user_id
        } else {
            const stamp = ago([40, 0])
            const [res] = await conn.execute(
                'INSERT INTO users (username, user_uuid, created_at, updated_at) VALUES (?, UUID_TO_BIN(?), ?, ?)',
                [TEAM_USERNAME, randomUUID(), stamp, stamp]
            )
            userIds.team = res.insertId
        }
        const idFor = (who) => {
            if (who === null) return null
            if (!(who in userIds)) throw new Error(`demoData.mjs refers to an unknown user "${who}"`)
            return userIds[who]
        }

        // ---- helpers ----
        const counts = { users: USERS.length, posts: 0, replies: 0, events: 0, faqs: 0, photos: 0, likes: 0 }
        // Likes: each post gets a steady, made-up number of likes from the demo people (never the
        // author, the admin, or the dean's account, so the dean can like and un-like to see it work).
        const LIKE_COUNTS = [9, 14, 11, 16, 7, 12, 18, 6, 13, 10, 15, 8, 17, 5, 12, 9, 14, 11, 7, 16]
        const likePool = USERS.filter((u) => !u.isAdmin && !u.isDean).map((u) => u.username)
        const addLikes = async (threadId, index, author) => {
            const pool = likePool.filter((name) => name !== author)
            const wanted = Math.min(LIKE_COUNTS[index % LIKE_COUNTS.length], pool.length)
            for (let i = 0; i < wanted; i++) {
                const name = pool[(index * 5 + i) % pool.length]
                await conn.execute("INSERT INTO thread_reactions (user_id, thread_id, reaction_value) VALUES (?, ?, 'like')", [idFor(name), threadId])
                counts.likes++
            }
        }
        const insertThread = async ({ who, text, title, category, photo, createdAt }) => {
            const fields = ['user_id', 'thread_uuid', 'title', 'content', 'category', 'created_at', 'updated_at']
            const marks = ['?', 'UUID_TO_BIN(?)', '?', '?', '?', '?', '?']
            const params = [idFor(who), randomUUID(), title, text, category, createdAt, createdAt]
            if (threadPhotos && photo) {
                fields.push('photo_url')
                marks.push('?')
                params.push(photo)
                counts.photos++
            }
            const [res] = await conn.execute(`INSERT INTO threads (${fields.join(', ')}) VALUES (${marks.join(', ')})`, params)
            return res.insertId
        }
        const insertReplies = async (threadId, replies) => {
            for (const r of replies) {
                if (r.user === null && !anonymousOk) continue
                const createdAt = ago(r.ago)
                const fields = ['comment_uuid', 'user_id', 'thread_id', 'content', 'created_at', 'updated_at']
                const marks = ['UUID_TO_BIN(?)', '?', '?', '?', '?', '?']
                const params = [randomUUID(), idFor(r.user), threadId, r.text, createdAt, createdAt]
                const photo = photoUrl(r.photo)
                if (commentPhotos && photo) {
                    fields.push('photo_url')
                    marks.push('?')
                    params.push(photo)
                    counts.photos++
                }
                await conn.execute(`INSERT INTO comments (${fields.join(', ')}) VALUES (${marks.join(', ')})`, params)
                counts.replies++
            }
        }

        // ---- community posts ----
        for (const [postIndex, p] of POSTS.entries()) {
            if (p.user === null && !anonymousOk) continue
            const threadId = await insertThread({
                who: p.user, text: p.text, title: p.text.slice(0, 200), category: 'general',
                photo: photoUrl(p.photo), createdAt: ago(p.ago),
            })
            counts.posts++
            await addLikes(threadId, postIndex, p.user)
            await insertReplies(threadId, p.replies)
        }

        // ---- FAQs ----
        for (const f of FAQS) {
            await insertThread({ who: 'team', text: f.text, title: f.title, category: 'faq', photo: null, createdAt: ago(f.ago) })
            counts.faqs++
        }

        // ---- events (each with its linked community post) ----
        for (const [eventIndex, e] of EVENTS.entries()) {
            const posted = ago([e.inDays > 30 ? 6 : 3, 3])
            const photo = photoUrl(e.photo)
            const threadId = await insertThread({
                who: e.organizer, text: e.description, title: `${e.title} — Event`, category: 'events',
                photo: null, createdAt: posted,
            })
            const startedAt = startsIn(e.inDays, e.hour, e.minute)
            const endedAt = new Date(startedAt.getTime() + 2 * 3600 * 1000)
            await conn.execute(
                'INSERT INTO events (event_uuid, event_title, event_description, started_at, ended_at, created_by_user_id, thread_id, photo_url, created_at, updated_at) VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [randomUUID(), e.title, e.description, startedAt, endedAt, idFor(e.organizer), threadId, photo, posted, posted]
            )
            if (photo) counts.photos++
            counts.events++
            await addLikes(threadId, eventIndex + 7, e.organizer)
            await insertReplies(threadId, e.replies)
        }

        await conn.commit()
        log(`Done: ${counts.users} users, ${counts.posts} community posts, ${counts.faqs} FAQs, ${counts.replies} replies, ${counts.events} events, ${counts.photos} photos, ${counts.likes} likes.`)
        log('Demo logins: Dean (the dean\'s account, uses DEAN_PASSWORD if set), Rosa, David, Lena ... and Admin (admin). The others use DEMO_PASSWORD.')
        return counts
    } catch (err) {
        await conn.rollback()
        throw err
    }
}

// ------------------------------------------------------------------------- CLI
async function main() {
    const dbName = process.env.DB_DATABASE || ''
    if (!/_demo$/i.test(dbName)) {
        console.error(`Refusing to run: DB_DATABASE is "${dbName}", which doesn't end in "_demo". This script only seeds the demo database.`)
        process.exit(1)
    }
    const { default: pool } = await import('../src/lib/pool.mjs')
    const { default: bcrypt } = await import('bcrypt')
    const { UPLOAD_ROOT } = await import('../src/lib/localStorage.mjs')
    const conn = await pool.getConnection()
    try {
        await seedDemo({
            conn,
            password: process.env.DEMO_PASSWORD,
            deanPassword: process.env.DEAN_PASSWORD || process.env.DEMO_PASSWORD,
            hashPassword: (plain) => bcrypt.hash(plain, 12),
            uploadDir: UPLOAD_ROOT,
        })
    } finally {
        conn.release()
        await pool.end()
    }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
    main().catch((err) => {
        console.error('Seeding failed:', err.message)
        process.exit(1)
    })
}