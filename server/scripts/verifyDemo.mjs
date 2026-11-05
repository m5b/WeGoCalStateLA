// Checks that the site works end to end, by actually using it: logs in as one account, loads the
// profile, events, and community feed, fetches a picture, likes and un-likes a post and a reply,
// replies to a reply, posts a picture-only reply, and writes then deletes a post. If an admin
// password is given it also checks the Admin account's powers (editing and deleting other
// people's posts and replies, opening the user list). Run through demo-db.sh ("verify"); the
// backend must already be pointed at the demo database ("use demo").
const BASE = `http://127.0.0.1:${process.env.PORT || 3000}`
const USER = process.env.VERIFY_USER || 'Dean'
const PASSWORD = process.env.VERIFY_PASSWORD
const ADMIN_USER = process.env.VERIFY_ADMIN_USER || 'Admin'
const ADMIN_PASSWORD = process.env.VERIFY_ADMIN_PASSWORD // optional

// A 1x1 picture, so the picture-reply check needs no files.
const TINY_PNG = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGP4z8DwHwAFAAH/q842iQAAAABJRU5ErkJggg==',
    'base64'
)

const results = []
const check = (name, ok, detail = '') => {
    results.push(ok)
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' -- ' + detail : ''}`)
    return ok
}

// Each login has its own cookie (a "session"); pass null for a visitor who is signed out.
async function call(session, method, path, { body, form } = {}) {
    const headers = {}
    let payload
    if (form) {
        payload = form
    } else if (body !== undefined) {
        headers['Content-Type'] = 'application/json'
        payload = JSON.stringify(body)
    }
    if (session?.cookie) headers.cookie = session.cookie
    const res = await fetch(BASE + path, { method, headers, body: payload })
    const setCookie = res.headers.getSetCookie?.() ?? []
    return { res, setCookie, json: await res.json().catch(() => null) }
}

async function login(username, password) {
    const r = await call(null, 'POST', '/api/auth/login', { body: { identifier: username, password } })
    const auth = r.setCookie.find((c) => c.startsWith('auth_tx='))
    return { ok: r.res.ok && !!auth, status: r.res.status, session: auth ? { cookie: auth.split(';')[0] } : null }
}

// Right after "use demo" the backend is still restarting, so wait for it (up to 60 seconds)
// instead of failing on the first refused connection.
async function waitForBackend() {
    for (let i = 0; i < 60; i++) {
        try {
            const res = await fetch(BASE + '/api/health')
            if (res.ok) return true
        } catch {
            // not listening yet
        }
        await new Promise((resolve) => setTimeout(resolve, 1000))
    }
    return false
}

async function main() {
    if (!PASSWORD) {
        console.error('Set VERIFY_PASSWORD to the password of the account to test.')
        process.exit(2)
    }

    const backendUp = await waitForBackend()
    if (!check('Backend is up', backendUp, backendUp ? '' : 'could not reach it for 60 seconds; see: docker compose -f composePrototype.yml logs --tail=30 backend')) process.exit(1)

    // 1. Log in
    const first = await login(USER, PASSWORD)
    if (!check(`Log in as ${USER}`, first.ok, first.ok ? '' : `status ${first.status}. Is the backend on the demo database (use demo), and is this the right password?`)) process.exit(1)
    const dean = first.session

    // 2. Profile
    const me = await call(dean, 'GET', '/api/user/me')
    const user = me.json?.data?.user
    check('Profile loads and matches the account', me.res.ok && user?.username === USER, user ? `alias "${user.alias ?? ''}"` : `status ${me.res.status}`)

    // 3. Events and a picture
    const events = (await call(dean, 'GET', '/api/events')).json?.data?.events ?? []
    check('Events list has events', events.length >= 8, `${events.length} events`)
    const withPicture = events.find((e) => e.imageUri)
    if (withPicture) {
        const pic = await fetch(BASE + withPicture.imageUri)
        check('An event picture loads', pic.ok && (pic.headers.get('content-type') || '').startsWith('image/'), `${withPicture.imageUri} -> ${pic.status}`)
    } else {
        check('An event picture loads', false, 'no event has a picture')
    }

    // 4. Community feed: covers, reply counts, likes, privacy
    const threads = (await call(dean, 'GET', '/api/threads')).json?.data?.threads ?? []
    check('Community feed has posts', threads.length >= 20, `${threads.length} posts`)
    check('Posts have cover pictures', threads.some((t) => t.photoUrl), `${threads.filter((t) => t.photoUrl).length} with a cover`)
    check('Reply counts come with the feed', threads.some((t) => t.replyCount > 0), 'no need to open a post first')
    check('Like counts come with the feed', threads.some((t) => t.likeCount > 0))
    check('FAQs are in the feed', threads.some((t) => t.category === 'faq'), `${threads.filter((t) => t.category === 'faq').length} FAQs`)
    const visitorThreads = (await call(null, 'GET', '/api/threads')).json?.data?.threads ?? []
    const open = visitorThreads.filter((t) => !t.locked).length
    check('Signed-out visitors can read some posts and not others', open > 0 && open < visitorThreads.length, `${open} open, ${visitorThreads.length - open} private`)

    // 5. Replies: nesting and likes on replies exist in the demo data
    let sawNested = false
    let sawReplyLikes = false
    for (const t of threads.filter((x) => x.replyCount > 0).slice(0, 15)) {
        const list = (await call(dean, 'GET', `/api/comments/thread/${t.threadUuid}`)).json?.data?.comments ?? []
        if (list.some((c) => c.parentCommentUuid)) sawNested = true
        if (list.some((c) => c.likeCount > 0)) sawReplyLikes = true
        if (sawNested && sawReplyLikes) break
    }
    check('Some replies are replies to other replies', sawNested)
    check('Replies show like counts', sawReplyLikes)

    // 6. Open a post, then try the things a person does
    const target = threads.find((t) => t.category === 'general' && t.replyCount > 0 && !t.likedByMe && !t.locked)
    let admin = null
    if (ADMIN_PASSWORD) {
        const a = await login(ADMIN_USER, ADMIN_PASSWORD)
        check(`Log in as ${ADMIN_USER}`, a.ok, a.ok ? '' : `status ${a.status}. Is ADMIN_PASSWORD the one the demo was seeded with?`)
        if (a.ok) {
            admin = a.session
            const am = await call(admin, 'GET', '/api/user/me')
            check(`${ADMIN_USER} is an admin account`, am.json?.data?.user?.isAdmin === true)
            check('Admin can open the user list', (await call(admin, 'GET', '/api/admin/users')).res.ok)
            const denied = await call(dean, 'GET', '/api/admin/users')
            check(`${USER} (a regular account) cannot open the user list`, denied.res.status === 403 || denied.res.status === 401, `status ${denied.res.status}`)
        }
    }

    if (check('Found a post to try', !!target)) {
        const detail = await call(dean, 'GET', `/api/comments/thread/${target.threadUuid}`)
        const list = detail.json?.data?.comments ?? []
        check('Opening a post shows its replies', list.length > 0)

        // Like, then take the like back (post)
        const like1 = await call(dean, 'POST', `/api/threads/${target.threadUuid}/like`, { body: {} })
        check('Liking a post works', like1.json?.data?.liked === true && like1.json?.data?.likeCount === target.likeCount + 1, `count ${target.likeCount} -> ${like1.json?.data?.likeCount}`)
        const like2 = await call(dean, 'POST', `/api/threads/${target.threadUuid}/like`, { body: {} })
        check('Un-liking puts it back', like2.json?.data?.liked === false && like2.json?.data?.likeCount === target.likeCount, `count back to ${like2.json?.data?.likeCount}`)

        // A regular account cannot change someone else's post (sends the post's own text, so nothing changes even if it were allowed)
        const t = detail.json?.data?.threadDto
        if (t?.title && t?.body) {
            const edit = await call(dean, 'PATCH', `/api/threads/me/${target.threadUuid}`, { body: { title: t.title, content: t.body, category: t.category } })
            check(`${USER} cannot edit someone else's post`, edit.res.status === 401 || edit.res.status === 403, `status ${edit.res.status}`)
        }

        // Likes and replies on a reply
        const parent = list.find((c) => !c.parentCommentUuid && c.userUuid !== user?.userUuid)
        if (check('Found a reply to try', !!parent)) {
            const rl1 = await call(dean, 'POST', `/api/comments/${parent.commentUuid}/like`, { body: {} })
            check('Liking a reply works', rl1.json?.data?.liked === true && rl1.json?.data?.likeCount === parent.likeCount + 1, `count ${parent.likeCount} -> ${rl1.json?.data?.likeCount}`)
            const rl2 = await call(dean, 'POST', `/api/comments/${parent.commentUuid}/like`, { body: {} })
            check('Un-liking a reply puts it back', rl2.json?.data?.liked === false && rl2.json?.data?.likeCount === parent.likeCount)

            const nested = await call(dean, 'POST', `/api/comments/me/thread/${target.threadUuid}/comment/${parent.commentUuid}`, { body: { content: 'Verification reply to a reply (deleted right away).' } })
            const nestedId = nested.json?.data?.comment?.commentUuid
            check('Replying to a reply works', nested.res.ok && nested.json?.data?.comment?.parentCommentUuid === parent.commentUuid)
            if (nestedId) check('Deleting your own reply works', (await call(dean, 'DELETE', `/api/comments/me/${nestedId}`)).res.ok)
        }

        // A reply that is only a picture (no text)
        const form = new FormData()
        form.append('content', '')
        form.append('image', new Blob([TINY_PNG], { type: 'image/png' }), 'check.png')
        const pic = await call(dean, 'POST', `/api/comments/me/thread/${target.threadUuid}`, { form })
        const picComment = pic.json?.data?.comment
        check('A reply with only a picture works', pic.res.ok && !!picComment?.photoUrl, pic.res.ok ? '' : `status ${pic.res.status}: ${JSON.stringify(pic.json?.error ?? pic.json?.message ?? '')}`)
        if (picComment?.photoUrl) {
            const img = await fetch(BASE + picComment.photoUrl)
            check('The reply picture loads', img.ok && (img.headers.get('content-type') || '').startsWith('image/'), `${picComment.photoUrl} -> ${img.status}`)
        }
        if (picComment?.commentUuid) {
            // With an admin login, the admin removes Dean's reply (proves admins can delete other people's replies).
            const remover = admin ?? dean
            const del = await call(remover, 'DELETE', `/api/comments/me/${picComment.commentUuid}`)
            check(admin ? `${ADMIN_USER} can delete another person's reply` : 'Deleting your own picture reply works', del.res.ok, del.res.ok ? '' : `status ${del.res.status}`)
        }
    }

    // 7. Write a post, then clean it up
    const mine = await call(dean, 'POST', '/api/threads/me', { body: { title: 'Verification post from the demo check', content: 'Verification post (deleted right away).', category: 'general' } })
    const mineId = mine.json?.data?.thread?.threadUuid
    check('Creating a post works', mine.res.ok && !!mineId)
    if (mineId) {
        if (admin) {
            const edit = await call(admin, 'PATCH', `/api/threads/me/${mineId}`, { body: { title: 'Verification post edited by the admin check', content: 'Edited by an admin.', category: 'general' } })
            check(`${ADMIN_USER} can edit another person's post`, edit.res.ok, edit.res.ok ? '' : `status ${edit.res.status}`)
            check(`${ADMIN_USER} can delete another person's post`, (await call(admin, 'DELETE', `/api/threads/me/${mineId}`)).res.ok)
        } else {
            check('Deleting your own post works', (await call(dean, 'DELETE', `/api/threads/me/${mineId}`)).res.ok)
        }
    }

    await call(dean, 'POST', '/api/auth/logout')
    if (admin) await call(admin, 'POST', '/api/auth/logout')
    const failed = results.filter((ok) => !ok).length
    console.log(failed ? `\n${failed} check(s) FAILED.` : `\nAll ${results.length} checks passed. ${USER}${admin ? ` and ${ADMIN_USER} are` : ' is'} ready to hand over.`)
    process.exit(failed ? 1 : 0)
}

main().catch((err) => {
    console.error('Verification could not run:', err.message)
    process.exit(1)
})