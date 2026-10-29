// Checks that the site works end to end for one account, by actually using it: logs in, loads
// the profile, events, and community feed, fetches a picture, likes and un-likes a post, and
// writes then deletes a post. Run through demo-db.sh ("verify"); the backend must already be
// pointed at the demo database ("use demo").
const BASE = `http://127.0.0.1:${process.env.PORT || 3000}`
const USER = process.env.VERIFY_USER || 'Dean'
const PASSWORD = process.env.VERIFY_PASSWORD

const results = []
const check = (name, ok, detail = '') => {
    results.push(ok)
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' -- ' + detail : ''}`)
    return ok
}

let cookie = ''
async function call(method, path, { body, auth = true } = {}) {
    const headers = {}
    if (body !== undefined) headers['Content-Type'] = 'application/json'
    if (auth && cookie) headers.cookie = cookie
    const res = await fetch(BASE + path, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) })
    const setCookie = res.headers.getSetCookie?.() ?? []
    return { res, setCookie, json: await res.json().catch(() => null) }
}

async function main() {
    if (!PASSWORD) {
        console.error('Set VERIFY_PASSWORD to the password of the account to test.')
        process.exit(2)
    }

    const health = await call('GET', '/api/health', { auth: false })
    if (!check('Backend is up', health.res.ok)) process.exit(1)

    // 1. Log in
    const login = await call('POST', '/api/auth/login', { body: { identifier: USER, password: PASSWORD }, auth: false })
    const auth = login.setCookie.find((c) => c.startsWith('auth_tx='))
    if (!check(`Log in as ${USER}`, login.res.ok && !!auth, login.res.ok ? '' : `status ${login.res.status}. Is the backend on the demo database (use demo), and is this the right password?`)) process.exit(1)
    cookie = auth.split(';')[0]

    // 2. Profile
    const me = await call('GET', '/api/user/me')
    const user = me.json?.data?.user
    check('Profile loads and matches the account', me.res.ok && user?.username === USER, user ? `alias "${user.alias ?? ''}"` : `status ${me.res.status}`)

    // 3. Events and a picture
    const events = (await call('GET', '/api/events')).json?.data?.events ?? []
    check('Events list has events', events.length >= 8, `${events.length} events`)
    const withPicture = events.find((e) => e.imageUri)
    if (withPicture) {
        const pic = await fetch(BASE + withPicture.imageUri)
        check('An event picture loads', pic.ok && (pic.headers.get('content-type') || '').startsWith('image/'), `${withPicture.imageUri} -> ${pic.status}`)
    } else {
        check('An event picture loads', false, 'no event has a picture')
    }

    // 4. Community feed: covers, reply counts, likes
    const threads = (await call('GET', '/api/threads')).json?.data?.threads ?? []
    check('Community feed has posts', threads.length >= 20, `${threads.length} posts`)
    check('Posts have cover pictures', threads.some((t) => t.photoUrl), `${threads.filter((t) => t.photoUrl).length} with a cover`)
    check('Reply counts come with the feed', threads.some((t) => t.replyCount > 0), 'no need to open a post first')
    check('Like counts come with the feed', threads.some((t) => t.likeCount > 0))
    check('FAQs are in the feed', threads.some((t) => t.category === 'faq'), `${threads.filter((t) => t.category === 'faq').length} FAQs`)

    // 5. Open a post
    const target = threads.find((t) => t.category === 'general' && t.replyCount > 0 && !t.likedByMe)
    if (check('Found a post to try', !!target)) {
        const detail = await call('GET', `/api/comments/thread/${target.threadUuid}`)
        check('Opening a post shows its replies', (detail.json?.data?.comments ?? []).length > 0)

        // 6. Like, then take the like back
        const like1 = await call('POST', `/api/threads/${target.threadUuid}/like`, { body: {} })
        check('Liking a post works', like1.json?.data?.liked === true && like1.json?.data?.likeCount === target.likeCount + 1, `count ${target.likeCount} -> ${like1.json?.data?.likeCount}`)
        const like2 = await call('POST', `/api/threads/${target.threadUuid}/like`, { body: {} })
        check('Un-liking puts it back', like2.json?.data?.liked === false && like2.json?.data?.likeCount === target.likeCount, `count back to ${like2.json?.data?.likeCount}`)
    }

    // 7. Write a post, then clean it up
    const mine = await call('POST', '/api/threads/me', { body: { title: 'Verification post from the demo check', content: 'Verification post (deleted right away).', category: 'general' } })
    const mineId = mine.json?.data?.thread?.threadUuid
    check('Creating a post works', mine.res.ok && !!mineId)
    if (mineId) {
        const del = await call('DELETE', `/api/threads/me/${mineId}`)
        check('Deleting your own post works', del.res.ok)
    }

    await call('POST', '/api/auth/logout')
    const failed = results.filter((ok) => !ok).length
    console.log(failed ? `\n${failed} check(s) FAILED.` : `\nAll ${results.length} checks passed. ${USER} is ready to hand over.`)
    process.exit(failed ? 1 : 0)
}

main().catch((err) => {
    console.error('Verification could not run:', err.message)
    process.exit(1)
})