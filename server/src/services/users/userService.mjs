import buildPatchQuery from '../../util/buildPatchQuery.mjs'
import dbMapper from '../../util/dbMapper.mjs'
import { NotFoundError } from '../../errors/notFoundError.mjs'
import { hasOwnTitle } from '../../util/visibility.mjs'
export function createUserService({userRepo}) {
    return{
        getByUserId,
        patchByUserId,
        patchByUserUuid,
        getByUsername,
        deleteByUserId,
        deleteByUserUuid,
        createUser,
        getUserCount,
        getByUserUuid,
        provisionUser,
        listUsers,
        countUsers,
        getAdminStats,
        getPublicProfile,
    }

    async function listUsers(opts) {
        const rows = await userRepo.findAll(opts)
        return rows.map((row) => dbMapper.fromDb(row))
    }

    // What a signed-in person sees when they open someone's profile (their own profile includes their
    // private posts and events; anyone else's only shows what is public).
    async function getPublicProfile({ userUuid, viewerUserUuid }) {
        const isSelf = String(userUuid).toLowerCase() === String(viewerUserUuid).toLowerCase()
        const row = await userRepo.findPublicProfile(userUuid, { includePrivate: isSelf })
        if (!row) {
            throw new NotFoundError(null, 'Can not found the user')
        }
        const [threads, events] = await Promise.all([
            userRepo.findRecentThreads(row.user_id, { includePrivate: isSelf, limit: 5 }),
            userRepo.findRecentEvents(row.user_id, { includePrivate: isSelf, limit: 5 }),
        ])
        const alias = row.alias && row.alias.trim() ? row.alias.trim() : null
        return {
            userUuid: row.user_uuid,
            username: row.username,
            alias,
            displayName: alias ?? row.username,
            relationship: row.relationship ?? null,
            interests: row.interests ?? '',
            isAdmin: Boolean(row.is_admin),
            memberSince: row.created_at,
            isSelf,
            stats: { posts: Number(row.post_count), replies: Number(row.reply_count), events: Number(row.event_count) },
            // Older posts have no title of their own, so those show the start of their text instead.
            recentPosts: threads.map((t) => ({
                threadUuid: t.thread_uuid,
                title: hasOwnTitle(t.title, t.content) ? t.title : (t.content ?? '').trim().slice(0, 80),
                isPublic: Boolean(t.is_public),
                createdAt: t.created_at,
            })),
            recentEvents: events.map((e) => ({
                eventUuid: e.event_uuid,
                title: e.event_title,
                startsAt: e.started_at,
                isPublic: Boolean(e.is_public),
            })),
        }
    }

    async function countUsers(opts) {
        return Number(await userRepo.countAll(opts))
    }

    async function getAdminStats() {
        const row = await userRepo.getAdminStats()
        return {
            members: Number(row.members),
            admins: Number(row.admins),
            newMembers: Number(row.new_members),
            posts: Number(row.posts),
            replies: Number(row.replies),
            events: Number(row.events),
            openReports: Number(row.open_reports),
        }
    }

    async function getUserCount(){
        const count = await userRepo.getCount()
        return count
    }

    async function createUser({username, userUuid, createdAt, emailHash = null, passwordHash = null, isAdmin = false}) {
        //perform database insertion for user creation
        const insertId = await userRepo.insertUser({
            username,
            userUuid,
            createdAt,
            emailHash,
            passwordHash,
            isAdmin,
        })
        return dbMapper.fromDb(await userRepo.findByUserId(insertId))
    }


    async function getByUserId(userId) {
        const user = dbMapper.fromDb(await userRepo.findByUserId(userId))
        if (!user) {
            throw new NotFoundError(
                null,
                'Can not found the user'
            )
        }
        return user
    }
    async function getByUsername(username) {
        const user = dbMapper.fromDb(await userRepo.findByUsername(username))
        if (!user) {
            throw new NotFoundError(null, 'Can not found the user')
        }
        return user
    }

    async function getByUserUuid(userUuid) {
        const user = dbMapper.fromDb(await userRepo.findByUserUuid(userUuid))
        if (!user) {
            throw new NotFoundError(null, 'Can not found the user')
        }
        return user
    }

    async function provisionUser({userUuid, username, createdAt}) {
        let user = dbMapper.fromDb(await userRepo.findByUserUuid(userUuid))
        if(user == null){
            user = await createUser({userUuid, username, createdAt})
        }
        return user
    }


    async function patchByUserId(userId, payload) {

        const { sqlQuery, dataList } = buildPatchQuery(
            'users',
            dbMapper.toDb(payload)
        )
        const {existed, changed} = await userRepo.updateByUserId(userId, sqlQuery, dataList)
        if(!existed){
            throw new NotFoundError(
                null,
                'Can not found current user'
            )
        }
        const user = await getByUserId(userId)
        return user
    }

    async function patchByUserUuid(userUuid, payload) {

        const { sqlQuery, dataList } = buildPatchQuery(
            'users',
            dbMapper.toDb(payload)
        )
        const {existed, changed} = await userRepo.updateByUserUuid(userUuid, sqlQuery, dataList)
        if(!existed){
            throw new NotFoundError(
                null,
                'Can not found current user'
            )
        }
        const user = await getByUserUuid(userUuid)
        return user
    }


    async function deleteByUserId(userId) {
        const removed = await userRepo.deleteByUserId(userId)
        //this mean not found user
        if(!removed){
            throw new NotFoundError(null ,"Can not found the user")
        }
    }

    async function deleteByUserUuid(userUuid) {
        const removed = await userRepo.deleteByUserUuid(userUuid)
        //this mean not found user
        if(!removed){
            throw new NotFoundError(null ,"Can not found the user")
        }
    }
}