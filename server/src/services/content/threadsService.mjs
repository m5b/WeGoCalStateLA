import dbMapper from '../../util/dbMapper.mjs'
import { NotFoundError } from '../../errors/notFoundError.mjs'
import { UnauthorizedError } from '../../errors/unauthorizedError.mjs'
import {GoneError} from "../../errors/goneError.mjs";
import buildPatchQuery from "../../util/buildPatchQuery.mjs";

import { v4 as uuidv4 } from 'uuid';

// uploadBuffer saves an uploaded photo and returns its URL (see lib/localStorage.mjs).
export function createThreadService(threadRepo, { uploadBuffer } = {}) {
    return {
        getAll,
        getByThreadId,
        getByThreadUuid,
        postByUserId,
        patchByThreadId,
        patchByThreadUuid,
        patchAnyByThreadUuid,
        getByUserId,
        getByUserUuid,
        deleteByThreadId,
        deleteByThreadUuid,
        markLikedBy,
        toggleLike
    }
    async function getAll() {
        const threads = dbMapper.fromDb(await threadRepo.findAll())
        return threads
    }

    async function getByThreadId(threadId) {
        const thread = dbMapper.fromDb(await threadRepo.findByThreadId(threadId))

        if (!thread) {
            throw new NotFoundError({
                thread: 'Cannot find thread with the given identifier',
            })
        }
        return thread
    }
    async function getByThreadUuid(threadUuid) {
        const thread = dbMapper.fromDb(await threadRepo.findByThreadUuid(threadUuid))

        if (!thread) {
            throw new NotFoundError({
                thread: 'Cannot find thread with the given identifier',
            })
        }
        return thread
    }

    async function getByUserId(userId) {
        const threads = dbMapper.fromDb(await threadRepo.findByUserId(userId))
        return threads
    }

    async function getByUserUuid(userUuid) {
        const threads = dbMapper.fromDb(await threadRepo.findByUserUuid(userUuid))
        return threads
    }

     // imageFile is multer's req.file (undefined when no photo was attached, or when
    // eventService creates a linked post).
    async function postByUserId(userId, payload, imageFile) {
        const { title, content, category, isPublic } = payload
        let photoUrl = null
        if (imageFile) {
            // Name the file from its type, never from the uploaded file name.
            const ext = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' }[imageFile.mimetype] ?? 'jpg'
            photoUrl = await uploadBuffer({ buffer: imageFile.buffer, key: `threads/${uuidv4()}.${ext}` })
        }
        const insertId = await threadRepo.insertThread({
            userId: userId,
            threadUuid: uuidv4(),
            title: title,
            content: content,
            category: category,
            photoUrl,
            isPublic: isPublic,
        })
        const thread = await getByThreadId(insertId)
        return thread
    }

    // Adds likedByMe to a thread (or a list of threads) for the signed-in user.
    // With no userId nothing is marked as liked.
    async function markLikedBy(threads, userId) {
        const list = Array.isArray(threads) ? threads : [threads]
        const liked = userId ? new Set(await threadRepo.findLikedThreadIds(userId)) : new Set()
        for (const thread of list) thread.likedByMe = liked.has(thread.threadId)
        return threads
    }
    // Likes the post if the user hasn't, un-likes it if they have.
    async function toggleLike({ threadUuid, userId }) {
        const thread = await getByThreadUuid(threadUuid)
        const liked = await threadRepo.toggleLike({ threadId: thread.threadId, userId })
        const likeCount = await threadRepo.countLikes(thread.threadId)
        return { liked, likeCount }
    }

    async function patchByThreadId({userId, threadId, payload}) {
        const { sqlQuery, dataList } = buildPatchQuery(
            'threads',
            dbMapper.toDb(payload)
        )

        const {existed,changed} = await threadRepo.updateByThreadId({threadId, userId,  sqlQuery, dataList})
        if(!existed){
            throw new UnauthorizedError(null, "You do not have permission to change this thread")
        }
        const thread = await getByThreadId(threadId)
        return thread
    }

    // isAdmin lets an admin edit any thread, not only their own.
    async function patchByThreadUuid({userId, threadUuid, payload, isAdmin = false}) {
        if (isAdmin) return patchAnyByThreadUuid({threadUuid, payload})
        const { sqlQuery, dataList } = buildPatchQuery(
            'threads',
            dbMapper.toDb(payload)
        )

        const {existed,changed} = await threadRepo.updateByThreadUuid({threadUuid, userId,  sqlQuery, dataList})
        if(!existed){
            throw new UnauthorizedError(null, "You do not have permission to change this thread")
        }
        const thread = await getByThreadUuid(threadUuid)
        return thread
    }

    // Edits a thread regardless of who wrote it.
    async function patchAnyByThreadUuid({threadUuid, payload}) {
        // Throws NotFound if the thread has been deleted.
        await getByThreadUuid(threadUuid)
        const { sqlQuery, dataList } = buildPatchQuery(
            'threads',
            dbMapper.toDb(payload)
        )

        const existed = await threadRepo.updateAnyByThreadUuid({threadUuid, sqlQuery, dataList})
        if(!existed){
            throw new NotFoundError({
                thread: 'Cannot find thread with the given identifier',
            })
        }
        return await getByThreadUuid(threadUuid)
    }

    async function deleteByThreadId({threadId, userId}) {
        const deleted = await threadRepo.deleteByThreadId(
            {threadId, userId}
        )
        if(!deleted){
            throw new UnauthorizedError(null, "You do not have permission to change this thread")
        }
    }
    // isAdmin lets an admin delete any thread, not only their own.
    async function deleteByThreadUuid({threadUuid, userId, isAdmin = false}) {
        if (isAdmin) {
            const removed = await threadRepo.deleteAnyByThreadUuid({threadUuid})
            if (!removed) {
                throw new NotFoundError({ thread: 'Cannot find thread with the given identifier' })
            }
            return
        }
        const deleted = await threadRepo.deleteByThreadUuid(
            {threadUuid, userId}
        )
        if(!deleted){
            throw new UnauthorizedError(null, "You do not have permission to change this thread")
        }
    }
}