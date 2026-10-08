import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import express from 'express'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import request from 'supertest'
import { createAIRouter } from '../../src/routes/aiRoutes.mjs'
import errorHandler from '../../src/middlewares/errorHandler.mjs'
import { AppError } from '../../src/errors/appError.mjs'

const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aDCsAAAAASUVORK5CYII=', 'base64')
const event = { title: 'Campus workshop', description: '', date: '2026-10-20', time: '2:30 PM', location: 'Room 101' }
const token = jwt.sign({}, process.env.JWT_SECRET || 'hello', {
    issuer: process.env.JWT_ISSUER || 'wegoapp', audience: 'access', subject: 'test-user', expiresIn: '5m',
})
let app, extractEvent, getByUserUuid

afterEach(() => vi.restoreAllMocks())

beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    extractEvent = vi.fn().mockResolvedValue(event)
    getByUserUuid = vi.fn().mockResolvedValue({ userId: 1, userUuid: 'test-user' })
    app = express()
    app.use(cookieParser())
    app.use('/api/ai', createAIRouter({ userService: { getByUserUuid }, eventExtractionService: { extractEvent } }))
    app.use(errorHandler)
})

function post(cookie = token) {
    const req = request(app).post('/api/ai/extract-event')
    return cookie ? req.set('Cookie', 'auth_tx=' + cookie) : req
}
function attach(req, data = png, contentType = 'image/png', field = 'image') {
    return req.attach(field, data, { filename: 'flyer', contentType })
}

describe('authenticated flyer upload', () => {
    it.each([null, 'invalid-token'])('rejects missing/invalid auth before processing upload', async (cookie) => {
        const res = await attach(post(cookie), Buffer.from('not an image'), 'application/pdf')
        expect(res.status).toBe(401)
        expect(extractEvent).not.toHaveBeenCalled()
        expect(getByUserUuid).not.toHaveBeenCalled()
    })

    it('checks the user and returns extracted fields in the existing JSend format', async () => {
        const res = await attach(post())
        expect(res.status).toBe(200)
        expect(res.body).toEqual({ status: 'success', data: event })
        expect(res.headers['cache-control']).toBe('no-store')
        expect(getByUserUuid).toHaveBeenCalledWith('test-user')
        expect(extractEvent).toHaveBeenCalledTimes(1)
        expect(extractEvent.mock.calls[0][0]).toMatchObject({ buffer: png, mimetype: 'image/png' })
        expect(extractEvent.mock.calls[0][0].path).toBeUndefined()
    })

    it.each([
        ['image/jpeg', Buffer.from([0xff, 0xd8, 0xff, 0xe0])],
        ['image/webp', Buffer.from('RIFF0000WEBP', 'ascii')],
    ])('accepts %s image headers', async (type, buffer) => {
        expect((await attach(post(), buffer, type)).status).toBe(200)
    })

    it('rejects files exceeding 5 MB without calling Gemini', async () => {
        const res = await attach(post(), Buffer.alloc(5 * 1024 * 1024 + 1))
        expect(res.status).toBe(413)
        expect(extractEvent).not.toHaveBeenCalled()
    })

    it('rejects unsupported MIME types', async () => {
        expect((await attach(post(), png, 'application/pdf')).status).toBe(415)
        expect(extractEvent).not.toHaveBeenCalled()
    })

    it('rejects text disguised as an image', async () => {
        expect((await attach(post(), Buffer.from('not an image'))).status).toBe(415)
        expect(extractEvent).not.toHaveBeenCalled()
    })

    it.each(['missing', 'empty', 'wrong-field', 'two-files', 'extra-field', 'json', 'malformed'])('rejects %s uploads', async (kind) => {
        let req = post()
        if (kind === 'missing') req = req.field('other', 'value')
        if (kind === 'empty') req = attach(req, Buffer.alloc(0))
        if (kind === 'wrong-field') req = attach(req, png, 'image/png', 'flyer')
        if (kind === 'two-files') req = attach(attach(req))
        if (kind === 'extra-field') req = attach(req).field('other', 'value')
        if (kind === 'json') req = req.send({ image: 'text' })
        if (kind === 'malformed') req = req.set('Content-Type', 'multipart/form-data').send('bad body')
        expect((await req).status).toBe(400)
        expect(extractEvent).not.toHaveBeenCalled()
    })

    it.each([429, 502, 503])('uses existing error handling for extraction error %s', async (status) => {
        extractEvent.mockRejectedValue(new AppError('Safe extraction error', status, 'AI_ERROR'))
        const res = await attach(post())
        expect(res.status).toBe(status)
        expect(res.body.message).toBe('Safe extraction error')
        expect(extractEvent).toHaveBeenCalledTimes(1)
    })
})
