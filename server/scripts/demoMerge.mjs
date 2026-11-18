// Puts the demo data together for seedDemo.mjs: the original lists from demoData.mjs, the handwritten extras
// from demoDataExtra.mjs, and lots of generated people, posts, replies, events and chats built from the topic
// banks in demoTopics.mjs. It is deterministic (a fixed seed), so seeding again gives the same demo each time.
import * as extra from './demoDataExtra.mjs'
import * as topics from './demoTopics.mjs'

const hoursOf = ([days, hours]) => days * 24 + hours
const agoOf = (hours) => {
    const h = Math.max(0, Math.round(hours))
    return [Math.floor(h / 24), h % 24]
}

// A small seeded random number generator (mulberry32), so "random" choices repeat exactly.
export function makeRng(seed) {
    let a = seed >>> 0
    return () => {
        a = (a + 0x6d2b79f5) >>> 0
        let t = a
        t = Math.imul(t ^ (t >>> 15), t | 1)
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

function shuffled(list, rng) {
    const copy = [...list]
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1))
        ;[copy[i], copy[j]] = [copy[j], copy[i]]
    }
    return copy
}
const pick = (list, rng) => list[Math.floor(rng() * list.length)]
const eventPostedAgo = (e) => [e.inDays > 30 ? 6 : 3, 3] // when an event's own post is made (see seedDemo.mjs)

// Replies written with `later` (hours after the one before) get a real `ago`, counted from startAgo.
export function timeReplies(replies, startAgo) {
    let hours = hoursOf(startAgo)
    return replies.map((r) => {
        if (r.ago) {
            hours = hoursOf(r.ago)
            return r
        }
        hours = Math.max(0, hours - r.later)
        return { ...r, ago: agoOf(hours) }
    })
}

// Short generated replies, each after the newest reply so far, never from the author, and never the same
// line twice in one thread. Everyone who replies has an account (replying needs one).
export function fillReplies({ replies, startAgo, count, pool, people, exclude, rng }) {
    if (!count) return []
    let hours = replies.length ? Math.min(...replies.map((r) => hoursOf(r.ago))) : hoursOf(startAgo)
    const candidates = people.filter((name) => name !== exclude)
    return shuffled(pool, rng)
        .slice(0, count)
        .map((text) => {
            hours = Math.max(0, hours - (1 + Math.floor(rng() * 10)))
            return { user: pick(candidates, rng), ago: agoOf(hours), text }
        })
}

// The site no longer allows replies without an account, so any anonymous reply becomes a named person.
function nameAnonymousReplies(replies, people, exclude, rng) {
    const candidates = people.filter((name) => name !== exclude)
    return replies.map((r) => (r.user === null ? { ...r, user: pick(candidates, rng) } : r))
}

const shiftKeys = (obj, offset) => Object.fromEntries(Object.entries(obj).map(([key, value]) => [Number(key) + offset, value]))

// ---- generated people
function makeUsers(tp, rng, taken) {
    const roles = tp.RELATIONSHIP_WEIGHTS.flatMap(([role, weight]) => Array(weight).fill(role))
    const aliases = new Set(taken.aliases)
    const interests = ['Career Wellness', 'Social Wellness', 'Financial Wellness', 'Physical Wellness', 'Community Wellness']
    return tp.GENERATED_NAMES.map((name) => {
        const relationship = pick(roles, rng)
        const patterns = tp.ALIAS_PATTERNS[relationship]
        const start = Math.floor(rng() * patterns.length)
        let alias = null
        for (let i = 0; i < patterns.length && !alias; i++) {
            const candidate = patterns[(start + i) % patterns.length].replace('{n}', name)
            if (!aliases.has(candidate)) alias = candidate
        }
        alias = alias ?? `${name} (${relationship})`
        aliases.add(alias)
        const chosen = shuffled(interests, rng).slice(0, 1 + Math.floor(rng() * 3))
        return { username: name, alias, relationship, interests: chosen.join(', ') }
    })
}

// ---- generated posts, from the topic banks
function generatePosts(tp, people, rng) {
    const posts = []
    const nested = {}
    for (const topic of tp.POST_TOPICS) {
        const authors = people.filter((u) => !topic.roles || topic.roles.includes(u.relationship))
        for (const [title, text] of topic.posts) {
            const author = pick(authors.length ? authors : people, rng)
            const ago = [Math.floor(rng() * 34), Math.floor(rng() * 24)]
            let photo
            if (topic.photos.length && rng() < 0.55) photo = pick(topic.photos, rng)
            else if (rng() < 0.12) photo = pick(tp.GENERAL_PHOTOS, rng)
            const lines = shuffled(topic.replies, rng).slice(0, 3 + Math.floor(rng() * 5))
            const repliers = shuffled(people.filter((u) => u.username !== author.username), rng)
            let hours = hoursOf(ago)
            const replies = lines.map((line, i) => {
                hours = Math.max(0, hours - (1 + Math.floor(rng() * 12)))
                return { user: repliers[i].username, ago: agoOf(hours), text: line }
            })
            const children = {}
            replies.forEach((reply, i) => {
                if (rng() >= 0.3) return
                const child = { user: pick(people.filter((u) => u.username !== reply.user), rng).username, later: 1 + Math.floor(rng() * 6), text: pick(tp.NEST_POOL, rng) }
                if (rng() < 0.3) child.replies = [{ user: reply.user, later: 1 + Math.floor(rng() * 4), text: pick(tp.NEST_POOL, rng) }]
                children[i] = [child]
            })
            if (Object.keys(children).length) nested[posts.length] = children
            posts.push({ user: author.username, ago, title, text, photo, replies, fill: Math.floor(rng() * 3) })
        }
    }
    return { posts, nested }
}

// ---- generated events, from the event types
function generateEvents(tp, people, rng, usedTitles) {
    const events = []
    const nested = {}
    // A title already used by another event gets a short suffix, so no two events share a title.
    const suffixes = [' (Evening Session)', ' (Weekend Edition)', ' (Round Two)', ' (Spring Series)']
    const uniqueTitle = (title) => {
        let candidate = title
        for (let i = 0; usedTitles.has(candidate); i++) candidate = title + suffixes[i % suffixes.length] + (i >= suffixes.length ? ` ${i}` : '')
        usedTitles.add(candidate)
        return candidate
    }
    const minutes = [0, 15, 30]
    for (const type of tp.EVENT_TYPES) {
        const organizers = people.filter((u) => !type.roles || type.roles.includes(u.relationship))
        type.titles.forEach((title, k) => {
            const organizer = pick(organizers.length ? organizers : people, rng)
            const roll = rng()
            const inDays = roll < 0.35 ? 1 + Math.floor(rng() * 14) : roll < 0.8 ? 15 + Math.floor(rng() * 46) : 61 + Math.floor(rng() * 80)
            const event = {
                organizer: organizer.username, inDays, hour: pick(type.hours, rng), minute: pick(minutes, rng),
                title: uniqueTitle(title), description: type.descriptions[k % type.descriptions.length],
                fill: 1 + Math.floor(rng() * 3), replies: [],
            }
            if (rng() >= 0.15) event.photo = type.photo
            const chain = shuffled(type.replies, rng).slice(0, 2 + Math.floor(rng() * 2))
            const askers = shuffled(people.filter((u) => u.username !== organizer.username), rng)
            event.replies = chain.map((line, i) => ({ user: askers[i].username, later: 2 + Math.floor(rng() * 8), text: line }))
            if (rng() < 0.4) {
                event.replies.push({ user: organizer.username, later: 2 + Math.floor(rng() * 5), text: 'Thank you for asking. We will share more details soon.' })
            }
            if (rng() < 0.25) nested[events.length] = { 0: [{ user: pick(people, rng).username, later: 2, text: pick(tp.NEST_POOL, rng) }] }
            events.push(event)
        })
    }
    return { events, nested }
}

// ---- generated background chats between other people
function generateChats(count, people, takenPairs, tp, ex, rng) {
    const chats = []
    let guard = 0
    while (chats.length < count && guard++ < count * 40) {
        const a = pick(people, rng).username
        const b = pick(people, rng).username
        const key = [a, b].sort().join('|')
        if (a === b || takenPairs.has(key)) continue
        takenPairs.add(key)
        const total = 4 + Math.floor(rng() * 9)
        const texts = shuffled(ex.DM_POOL, rng)
        let hours = 24 + Math.floor(rng() * 24 * 11)
        let from = rng() < 0.5 ? a : b
        const messages = []
        for (let i = 0; i < total; i++) {
            messages.push({ from, ago: agoOf(hours), read: true, text: texts[i % texts.length] })
            hours = Math.max(1, hours - (1 + rng() * 7))
            if (rng() < 0.7) from = from === a ? b : a
        }
        // Now and then the last message is still unread, so other people's badges show too.
        if (rng() < 0.15) messages[messages.length - 1].read = false
        chats.push({ between: [a, b], messages })
    }
    return chats
}

// base = what demoData.mjs exports. ex / tp = demoDataExtra.mjs / demoTopics.mjs (replaceable for tests).
export function buildDemoSet(base, ex = extra, tp = topics) {
    const rng = makeRng(20261105)
    const written = [
        ...base.USERS.map((u) => (ex.BASE_USER_INTERESTS[u.username] ? { ...u, interests: ex.BASE_USER_INTERESTS[u.username] } : u)),
        ...ex.EXTRA_USERS,
    ]
    const USERS = [...written, ...makeUsers(tp, rng, { aliases: written.map((u) => u.alias) })]
    // Who can write replies and generated posts: everyone except the admin and the dean's account.
    const people = USERS.filter((u) => !u.isAdmin && !u.isDean)
    const names = people.map((u) => u.username)

    // posts: the original ones (now with titles), the handwritten extras, and the generated ones
    const withReplies = (item, startAgo, count, pool, exclude) => {
        let replies = item.replies.some((r) => !r.ago) ? timeReplies(item.replies, startAgo) : item.replies
        replies = nameAnonymousReplies(replies, names, exclude, rng)
        return { ...item, replies: [...replies, ...fillReplies({ replies, startAgo, count, pool, people: names, exclude, rng })] }
    }
    const generatedPosts = generatePosts(tp, people, rng)
    const POSTS = [
        ...base.POSTS.map((p, i) => withReplies({ ...p, title: ex.BASE_POST_TITLES[i] }, p.ago, ex.MORE_FILL_FOR_POSTS[i] ?? 0, ex.REPLY_POOL, p.user)),
        ...ex.EXTRA_POSTS.map((p) => withReplies(p, p.ago, p.fill ?? 0, ex.REPLY_POOL, p.user)),
        ...generatedPosts.posts.map((p) => withReplies(p, p.ago, p.fill ?? 0, ex.REPLY_POOL, p.user)),
    ]

    // events
    const generatedEvents = generateEvents(tp, people, rng, new Set([...base.EVENTS, ...ex.EXTRA_EVENTS].map((e) => e.title)))
    const EVENTS = [
        ...base.EVENTS.map((e, i) => withReplies(e, eventPostedAgo(e), ex.MORE_FILL_FOR_EVENTS[i] ?? 0, ex.EVENT_REPLY_POOL, e.organizer)),
        ...ex.EXTRA_EVENTS.map((e) => withReplies(e, eventPostedAgo(e), e.fill ?? 0, ex.EVENT_REPLY_POOL, e.organizer)),
        ...generatedEvents.events.map((e) => withReplies(e, eventPostedAgo(e), e.fill ?? 0, ex.EVENT_REPLY_POOL, e.organizer)),
    ]

    // private messages
    const handwrittenChats = [...base.DIRECT_MESSAGES, ...ex.EXTRA_DIRECT_MESSAGES]
    const takenPairs = new Set(handwrittenChats.map((c) => [...c.between].sort().join('|')))
    const DIRECT_MESSAGES = [...handwrittenChats, ...generateChats(ex.GENERATED_CONVERSATIONS, people, takenPairs, tp, ex, rng)]

    return {
        USERS,
        POSTS,
        EVENTS,
        FAQS: [...base.FAQS, ...ex.EXTRA_FAQS],
        POST_NESTED: {
            ...base.POST_NESTED,
            ...shiftKeys(ex.EXTRA_POST_NESTED, base.POSTS.length),
            ...shiftKeys(generatedPosts.nested, base.POSTS.length + ex.EXTRA_POSTS.length),
        },
        EVENT_NESTED: {
            ...base.EVENT_NESTED,
            ...shiftKeys(ex.EXTRA_EVENT_NESTED, base.EVENTS.length),
            ...shiftKeys(generatedEvents.nested, base.EVENTS.length + ex.EXTRA_EVENTS.length),
        },
        DIRECT_MESSAGES,
        DIRECT_REPORTS: [
            ...base.DIRECT_REPORTS,
            ...ex.EXTRA_DIRECT_REPORTS.map((r) => ({ ...r, conversation: r.conversation + base.DIRECT_MESSAGES.length })),
        ],
        DIRECT_BLOCKS: ex.DIRECT_BLOCKS,
        DIRECT_CLOSED: ex.DIRECT_CLOSED ?? [],
    }
}

// What the server (and the app) treat as a title made from the body, not written by the author. A private
// thread only shows its title to signed-out visitors when it is NOT this. See server/src/util/visibility.mjs.
function generatedTitle(body) {
    const text = (body || '').trim()
    return text.length >= 20 ? (text.length <= 200 ? text : `${text.slice(0, 197)}...`) : (text || 'Community post').padEnd(20, '.')
}

// Looks for mistakes in the combined data (a misspelled username, a post without a real title, a reply that is
// older than its post, a picture that is not there, ...). Returns a list of problems; an empty list means all good.
export function checkDemoSet(set, { images = null } = {}) {
    const problems = []
    const names = new Set(set.USERS.map((u) => u.username))
    const known = (who, where, { allowNull = false } = {}) => {
        if (who === null) {
            if (!allowNull) problems.push(`${where}: replies can't be anonymous (replying needs an account)`)
        } else if (who !== 'team' && !names.has(who)) problems.push(`${where}: unknown user "${who}"`)
    }
    const picture = (file, where) => {
        if (file && images && !images.has(file)) problems.push(`${where}: picture "${file}" is not in server/demo/images`)
    }
    const walkChildren = (children, where) => {
        for (const child of children ?? []) {
            known(child.user, where)
            picture(child.photo, where)
            if (typeof child.later !== 'number' || child.later < 0) problems.push(`${where}: a nested reply needs a "later" number of hours`)
            walkChildren(child.replies, where)
        }
    }

    // people
    const dup = (list) => list.filter((n, i, all) => all.indexOf(n) !== i)
    if (dup(set.USERS.map((u) => u.username)).length) problems.push(`duplicate usernames: ${dup(set.USERS.map((u) => u.username)).join(', ')}`)
    if (dup(set.USERS.map((u) => u.alias)).length) problems.push(`duplicate aliases: ${dup(set.USERS.map((u) => u.alias)).join(', ')}`)
    const RELATIONSHIPS = new Set(['Parent', 'Guardian', 'Sibling', 'Spouse / Partner', 'Friend', 'Supporter / Mentor', 'Other'])
    const INTERESTS = new Set(['Career Wellness', 'Social Wellness', 'Financial Wellness', 'Physical Wellness', 'Community Wellness'])
    for (const u of set.USERS) {
        if (u.alias.length > 40) problems.push(`${u.username}: alias is longer than 40 characters`)
        if (!RELATIONSHIPS.has(u.relationship)) problems.push(`${u.username}: "${u.relationship}" is not a relationship the profile page offers`)
        for (const interest of u.interests.split(',').map((s) => s.trim())) {
            if (!INTERESTS.has(interest)) problems.push(`${u.username}: "${interest}" is not an interest the profile page offers`)
        }
    }

    // threads and their replies
    const checkThread = (item, kind, index, author, postedAgo, { allowAnonymousAuthor }) => {
        const where = `${kind} ${index} (${item.title ?? item.text?.slice(0, 30)})`
        known(author, where, { allowNull: allowAnonymousAuthor })
        picture(item.photo, where)
        const postedHours = hoursOf(postedAgo)
        item.replies.forEach((r, i) => {
            known(r.user, `${where}, reply ${i}`)
            picture(r.photo, `${where}, reply ${i}`)
            if (!r.ago) problems.push(`${where}, reply ${i}: no time`)
            else if (hoursOf(r.ago) > postedHours) problems.push(`${where}, reply ${i}: is older than the post it answers`)
        })
    }
    set.POSTS.forEach((p, i) => {
        checkThread(p, 'post', i, p.user, p.ago, { allowAnonymousAuthor: true })
        const title = (p.title ?? '').trim()
        if (title.length < 10 || title.length > 200) problems.push(`post ${i}: the title must be 10-200 characters ("${title}")`)
        else if (title === generatedTitle(p.text)) problems.push(`post ${i}: its title is just its text, so private visitors would see "Private conversation"`)
    })
    const postTitles = set.POSTS.map((p) => p.title)
    if (dup(postTitles).length) problems.push(`two posts have the same title: ${[...new Set(dup(postTitles))].join(' | ')}`)
    set.EVENTS.forEach((e, i) => {
        checkThread(e, 'event', i, e.organizer, eventPostedAgo(e), { allowAnonymousAuthor: false })
        if (e.inDays < 0) problems.push(`event ${i}: is in the past, so the Events tab would hide it`)
        if (e.hour < 0 || e.hour > 23 || e.minute < 0 || e.minute > 59) problems.push(`event ${i}: bad time`)
        if (`${e.title} — Event`.length < 10) problems.push(`event ${i}: title too short`)
    })
    if (dup(set.EVENTS.map((e) => e.title)).length) problems.push(`two events have the same title: ${[...new Set(dup(set.EVENTS.map((e) => e.title)))].join(' | ')}`)
    if (dup(set.FAQS.map((f) => f.title)).length) problems.push('two FAQs have the same question')
    for (const f of set.FAQS) if (f.title.length < 10) problems.push(`FAQ "${f.title}": title too short`)
    for (const [key, byReply] of Object.entries(set.POST_NESTED)) {
        const post = set.POSTS[Number(key)]
        if (!post) { problems.push(`nested replies for post ${key}, which does not exist`); continue }
        for (const [replyIndex, children] of Object.entries(byReply)) {
            if (!post.replies[Number(replyIndex)]) problems.push(`post ${key}: nested replies under reply ${replyIndex}, which does not exist`)
            walkChildren(children, `post ${key} nested`)
        }
    }
    for (const [key, byReply] of Object.entries(set.EVENT_NESTED)) {
        const event = set.EVENTS[Number(key)]
        if (!event) { problems.push(`nested replies for event ${key}, which does not exist`); continue }
        for (const [replyIndex, children] of Object.entries(byReply)) {
            if (!event.replies[Number(replyIndex)]) problems.push(`event ${key}: nested replies under reply ${replyIndex}, which does not exist`)
            walkChildren(children, `event ${key} nested`)
        }
    }

    // private messages
    const pairs = new Set()
    set.DIRECT_MESSAGES.forEach((c, i) => {
        const where = `conversation ${i} (${c.between.join(' / ')})`
        const [a, b] = c.between
        known(a, where)
        known(b, where)
        if (a === b) problems.push(`${where}: a person cannot message themselves`)
        const key = [a, b].sort().join('|')
        if (pairs.has(key)) problems.push(`${where}: this pair already has a conversation`)
        pairs.add(key)
        let last = Infinity
        c.messages.forEach((m, j) => {
            if (m.from !== a && m.from !== b) problems.push(`${where}, message ${j}: sent by someone who is not in it`)
            picture(m.photo, `${where}, message ${j}`)
            if (!m.text && !m.photo) problems.push(`${where}, message ${j}: empty`)
            const hours = hoursOf(m.ago)
            if (hours > last) problems.push(`${where}, message ${j}: out of order (older than the one before)`)
            last = hours
        })
    })
    set.DIRECT_REPORTS.forEach((r, i) => {
        const convo = set.DIRECT_MESSAGES[r.conversation]
        const message = convo?.messages[r.message]
        if (!message) { problems.push(`report ${i}: points at a message that does not exist`); return }
        known(r.reporter, `report ${i}`)
        const other = message.from === convo.between[0] ? convo.between[1] : convo.between[0]
        if (r.reporter !== other) problems.push(`report ${i}: ${r.reporter} must be the person who RECEIVED the reported message (${other})`)
    })
    for (const b of set.DIRECT_BLOCKS) {
        known(b.blocker, 'block')
        known(b.blocked, 'block')
    }

    // A closure is made one hour before the seed runs, so a conversation only stays closed if its newest message
    // is at least an hour old.
    for (const c of set.DIRECT_CLOSED ?? []) {
        known(c.user, 'closed conversation')
        known(c.other, 'closed conversation')
        const convo = set.DIRECT_MESSAGES.find((m) => m.between.includes(c.user) && m.between.includes(c.other))
        if (!convo) problems.push(`closed conversation ${c.user} / ${c.other}: they have no conversation`)
        else if (Math.min(...convo.messages.map((m) => hoursOf(m.ago))) < 1) problems.push(`closed conversation ${c.user} / ${c.other}: has a message newer than the closure, so it would show again`)
    }
    return problems
}