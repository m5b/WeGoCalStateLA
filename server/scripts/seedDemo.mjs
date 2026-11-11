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
import * as baseData from './demoData.mjs'
import { buildDemoSet } from './demoMerge.mjs'

// The original demo data (demoData.mjs) plus the extra data and everything generated from the topic banks
// (demoMerge.mjs).
const { USERS, POSTS, EVENTS, FAQS, POST_NESTED, EVENT_NESTED, DIRECT_MESSAGES, DIRECT_REPORTS, DIRECT_BLOCKS } = buildDemoSet(baseData)

const HERE = path.dirname(fileURLToPath(import.meta.url))
const IMAGE_DIR = path.resolve(HERE, '../demo/images')
const TEAM_USERNAME = 'WeGo Community Team'
const PHOTO_URL_PREFIX = '/api/uploads/demo/'

// Same rule the login form enforces, so demo accounts can actually sign in.
const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,21}$/

// conn: a mysql2 connection (promise API). hashPassword(plain) -> hash.
export async function seedDemo({ conn, hashPassword, password, deanPassword = password, adminPassword = password, imageDir = IMAGE_DIR, uploadDir, now = new Date(), log = console.log }) {
    if (!PASSWORD_RULE.test(password || '')) {
        throw new Error('DEMO_PASSWORD must be 8-21 characters with upper, lower, digit, and one of @$!%*?& (same rule as the login form).')
    }
    if (!PASSWORD_RULE.test(deanPassword || '')) {
        throw new Error('DEAN_PASSWORD must be 8-21 characters with upper, lower, digit, and one of @$!%*?& (same rule as the login form).')
    }
    if (!PASSWORD_RULE.test(adminPassword || '')) {
        throw new Error('ADMIN_PASSWORD must be 8-21 characters with upper, lower, digit, and one of @$!%*?& (same rule as the login form).')
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
    const commentEdited = await hasColumn('comments', 'edited_at')
    const hasTable = async (table) => {
        const [rows] = await conn.execute(
            'SELECT COUNT(*) AS n FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = ?',
            [table]
        )
        return Number(rows[0].n) > 0
    }
    const messagesReady = (await hasTable('direct_messages')) && (await hasTable('user_blocks')) && (await hasTable('message_reports'))
    const threadPublic = await hasColumn('threads', 'is_public')
    const eventPublic = await hasColumn('events', 'is_public')
    const [[nullRow]] = await conn.execute(
        "SELECT is_nullable AS nullable FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'comments' AND column_name = 'user_id'"
    )
    const anonymousOk = nullRow && nullRow.nullable === 'YES'
    if (!threadPhotos) log('Note: the post photo column was not found, so posts show only the event pictures. Run the migrations to add post pictures.')
    if (!commentPhotos) log('Note: replies cannot carry pictures yet, so the two replies with pictures are added without them.')
    if (!anonymousOk) log('Note: anonymous posting columns not found, so anonymous posts/replies are skipped.')
    if (!messagesReady) log('Note: the direct message tables were not found, so there are no demo messages. Run the migrations to add them.')

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
        // Messages point at users, so they go before the demo people do.
        if (messagesReady) {
            for (const table of ['message_reports', 'user_blocks', 'direct_messages']) {
                await conn.execute(`DELETE FROM ${table}`)
            }
        }
        // A reply can point at a parent reply, and MySQL checks that one row at a time (it refuses to
        // delete a parent before the replies under it), so detach them first.
        await conn.execute('UPDATE comments SET parent_comment_id = NULL')
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
        const adminHash = adminPassword === password ? passwordHash : await hashPassword(adminPassword)
        const userIds = {}
        for (const u of USERS) {
            const stamp = ago([40, 0])
            const [res] = await conn.execute(
                'INSERT INTO users (username, alias, relationship, interests, password_hash, is_admin, user_uuid, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, UUID_TO_BIN(?), ?, ?)',
                [u.username, u.alias, u.relationship, u.interests, u.isDean ? deanHash : u.isAdmin ? adminHash : passwordHash, u.isAdmin ? 1 : 0, randomUUID(), stamp, stamp]
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
        const counts = { users: USERS.length, posts: 0, replies: 0, events: 0, faqs: 0, photos: 0, likes: 0, publicThreads: 0, nested: 0, replyLikes: 0, messages: 0, reports: 0, blocks: 0 }
        // Likes: each post gets a steady, made-up number of likes from the demo people (never the
        // author, the admin, or the dean's account, so the dean can like and un-like to see it work).
        const LIKE_COUNTS = [24, 31, 18, 40, 12, 27, 35, 9, 22, 30, 16, 38, 14, 26, 33, 11, 29, 20, 36, 15]
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
        // Which posts and events signed-out visitors can read in full: about two thirds of the posts and
        // three quarters of the events, so the demo shows both the open look and the private ("sign in
        // to read") look. FAQs are help content, so they are always public. A post or event in
        // demoData.mjs can set isPublic: true or false to override this.
        const publicPost = (index) => index % 3 !== 2
        const publicEvent = (index) => index % 4 !== 3
        const insertThread = async ({ who, text, title, category, photo, createdAt, isPublic = false }) => {
            const fields = ['user_id', 'thread_uuid', 'title', 'content', 'category', 'created_at', 'updated_at']
            const marks = ['?', 'UUID_TO_BIN(?)', '?', '?', '?', '?', '?']
            const params = [idFor(who), randomUUID(), title, text, category, createdAt, createdAt]
            if (threadPhotos && photo) {
                fields.push('photo_url')
                marks.push('?')
                params.push(photo)
                counts.photos++
            }
            if (threadPublic) {
                fields.push('is_public')
                marks.push('?')
                params.push(isPublic ? 1 : 0)
                if (isPublic) counts.publicThreads++
            }
            const [res] = await conn.execute(`INSERT INTO threads (${fields.join(', ')}) VALUES (${marks.join(', ')})`, params)
            return res.insertId
        }
        // Likes on replies: a steady, made-up number from the demo people (never the reply's author,
        // the admin, or the dean's account).
        const REPLY_LIKE_COUNTS = [3, 0, 5, 2, 7, 1, 0, 4, 6, 2]
        let replySeen = 0
        let editedSeen = 0
        const addReplyLikes = async (commentId, author) => {
            const index = replySeen++
            const pool = likePool.filter((name) => name !== author)
            const wanted = Math.min(REPLY_LIKE_COUNTS[index % REPLY_LIKE_COUNTS.length], pool.length)
            for (let i = 0; i < wanted; i++) {
                const name = pool[(index * 3 + i) % pool.length]
                await conn.execute("INSERT INTO comment_reactions (user_id, comment_id, reaction_value) VALUES (?, ?, 'like')", [idFor(name), commentId])
                counts.replyLikes++
            }
        }
        const insertReply = async ({ threadId, r, createdAt, parentId = null }) => {
            const fields = ['comment_uuid', 'user_id', 'thread_id', 'content', 'created_at', 'updated_at']
            const marks = ['UUID_TO_BIN(?)', '?', '?', '?', '?', '?']
            const params = [randomUUID(), idFor(r.user), threadId, r.text, createdAt, createdAt]
            if (parentId) {
                fields.push('parent_comment_id')
                marks.push('?')
                params.push(parentId)
            }
            const photo = photoUrl(r.photo)
            if (commentPhotos && photo) {
                fields.push('photo_url')
                marks.push('?')
                params.push(photo)
                counts.photos++
            }
            // A few replies show up as edited, so the demo shows the "edited" marker.
            if (commentEdited && editedSeen++ % 9 === 4) {
                fields.push('edited_at')
                marks.push('?')
                params.push(new Date(Math.min(now.getTime(), createdAt.getTime() + 40 * 60 * 1000)))
            }
            const [res] = await conn.execute(`INSERT INTO comments (${fields.join(', ')}) VALUES (${marks.join(', ')})`, params)
            counts.replies++
            return res.insertId
        }

        // Adds the replies under a reply, and the replies under those, as deep as the data goes
        // (a reply entry can have its own `replies` list). `later` is hours after the reply it answers.
        const insertChildren = async (threadId, parentId, parentAt, children) => {
            for (const child of children ?? []) {
                const childAt = new Date(Math.min(now.getTime(), parentAt.getTime() + child.later * 3600 * 1000))
                const childId = await insertReply({ threadId, r: child, createdAt: childAt, parentId })
                await addReplyLikes(childId, child.user)
                counts.nested++
                await insertChildren(threadId, childId, childAt, child.replies)
            }
        }
        // nested: { [replyIndex]: [replies to that reply] }
        const insertReplies = async (threadId, replies, nested = {}) => {
            for (const [i, r] of replies.entries()) {
                if (r.user === null && !anonymousOk) continue
                const createdAt = ago(r.ago)
                const commentId = await insertReply({ threadId, r, createdAt })
                await addReplyLikes(commentId, r.user)
                await insertChildren(threadId, commentId, createdAt, nested[i])
            }
        }

        // ---- community posts ----
        for (const [postIndex, p] of POSTS.entries()) {
            if (p.user === null && !anonymousOk) continue
            const threadId = await insertThread({
                who: p.user, text: p.text, title: p.title, category: 'general',
                photo: photoUrl(p.photo), createdAt: ago(p.ago), isPublic: p.isPublic ?? publicPost(postIndex),
            })
            counts.posts++
            await addLikes(threadId, postIndex, p.user)
            await insertReplies(threadId, p.replies, POST_NESTED[postIndex])
        }

        // ---- FAQs ----
        for (const f of FAQS) {
            await insertThread({ who: 'team', text: f.text, title: f.title, category: 'faq', photo: null, createdAt: ago(f.ago), isPublic: true })
            counts.faqs++
        }

        // ---- events (each with its linked community post) ----
        for (const [eventIndex, e] of EVENTS.entries()) {
            const posted = ago([e.inDays > 30 ? 6 : 3, 3])
            const photo = photoUrl(e.photo)
            const isPublic = e.isPublic ?? publicEvent(eventIndex)
            const threadId = await insertThread({
                who: e.organizer, text: e.description, title: `${e.title} — Event`, category: 'events',
                photo: null, createdAt: posted, isPublic,
            })
            const startedAt = startsIn(e.inDays, e.hour, e.minute)
            const endedAt = new Date(startedAt.getTime() + 2 * 3600 * 1000)
            const eventFields = ['event_uuid', 'event_title', 'event_description', 'started_at', 'ended_at', 'created_by_user_id', 'thread_id', 'photo_url', 'created_at', 'updated_at']
            const eventMarks = ['UUID_TO_BIN(?)', '?', '?', '?', '?', '?', '?', '?', '?', '?']
            const eventParams = [randomUUID(), e.title, e.description, startedAt, endedAt, idFor(e.organizer), threadId, photo, posted, posted]
            if (eventPublic) {
                eventFields.push('is_public')
                eventMarks.push('?')
                eventParams.push(isPublic ? 1 : 0)
            }
            await conn.execute(`INSERT INTO events (${eventFields.join(', ')}) VALUES (${eventMarks.join(', ')})`, eventParams)
            if (photo) counts.photos++
            counts.events++
            await addLikes(threadId, eventIndex + 7, e.organizer)
            await insertReplies(threadId, e.replies, EVENT_NESTED[eventIndex])
        }

        // ---- direct messages (private conversations for the Messages page) ----
        if (messagesReady) {
            const stored = []
            for (const [convoIndex, convo] of DIRECT_MESSAGES.entries()) {
                stored[convoIndex] = []
                const [first, second] = convo.between
                for (const m of convo.messages) {
                    const recipient = m.from === first ? second : first
                    const sentAt = ago(m.ago)
                    // A picture is copied into the private folder (not the public uploads one).
                    let photoKey = null
                    if (m.photo && available.has(m.photo) && uploadDir) {
                        await fs.mkdir(path.join(uploadDir, '_private', 'messages'), { recursive: true })
                        await fs.copyFile(path.join(imageDir, m.photo), path.join(uploadDir, '_private', 'messages', `demo-${m.photo}`))
                        photoKey = `_private/messages/demo-${m.photo}`
                    }
                    const readAt = m.read ? new Date(Math.min(now.getTime(), sentAt.getTime() + 10 * 60 * 1000)) : null
                    const [res] = await conn.execute(
                        'INSERT INTO direct_messages (message_uuid, sender_id, recipient_id, content, photo_key, created_at, read_at) VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?)',
                        [randomUUID(), idFor(m.from), idFor(recipient), m.text ?? '', photoKey, sentAt, readAt]
                    )
                    stored[convoIndex].push({ id: res.insertId, sender: m.from, text: m.text ?? '', photoKey })
                    counts.messages++
                }
            }
            for (const r of DIRECT_REPORTS) {
                const message = stored[r.conversation][r.message]
                await conn.execute(
                    'INSERT INTO message_reports (report_uuid, message_id, reporter_id, reported_user_id, reason, message_content, message_photo_key, resolved_at, resolved_by_user_id) VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?, ?, ?)',
                    [randomUUID(), message.id, idFor(r.reporter), idFor(message.sender), r.reason, message.text, message.photoKey,
                        r.resolved ? ago([1, 0]) : null, r.resolved ? idFor('Admin') : null]
                )
                counts.reports++
            }
            for (const b of DIRECT_BLOCKS) {
                await conn.execute('INSERT INTO user_blocks (blocker_id, blocked_id) VALUES (?, ?)', [idFor(b.blocker), idFor(b.blocked)])
                counts.blocks++
            }
            log(`Direct messages: ${counts.messages} messages in ${DIRECT_MESSAGES.length} conversations, ${counts.reports} reports for the admins, ${counts.blocks} blocks.`)
        }

        await conn.commit()
        log(`Done: ${counts.users} users, ${counts.posts} community posts, ${counts.faqs} FAQs, ${counts.replies} replies, ${counts.events} events, ${counts.photos} photos, ${counts.likes} likes, ${counts.publicThreads} of ${counts.posts + counts.faqs + counts.events} threads public, ${counts.nested} replies to replies, ${counts.replyLikes} likes on replies.`)
        log('Demo logins: Dean (the dean\'s account, uses DEAN_PASSWORD if set), Admin (an admin, uses ADMIN_PASSWORD if set), Rosa, David, Lena ... The others use DEMO_PASSWORD.')
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
            adminPassword: process.env.ADMIN_PASSWORD || process.env.DEMO_PASSWORD,
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