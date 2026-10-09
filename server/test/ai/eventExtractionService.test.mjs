import { afterEach, describe, expect, it, vi } from 'vitest'
import { createEventExtractionService } from '../../src/services/ai/eventExtractionService.mjs'

const image = { buffer: Buffer.from('flyer'), mimetype: 'image/png' }
const fields = { eventStatus: 'likely_event', eventStatusReason: 'A named workshop with date, start time, and location.', title: 'Campus workshop', description: '', date: '2026-10-20', time: '2:30 PM', location: 'Room 101' }

afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
})

function setup(text = JSON.stringify(fields)) {
    vi.stubEnv('GEMINI_API_KEY', 'test-key')
    const generateContent = vi.fn().mockResolvedValue({ text })
    const clientFactory = vi.fn(() => ({ models: { generateContent } }))
    return { service: createEventExtractionService({ clientFactory }), generateContent, clientFactory }
}

describe('event flyer extraction', () => {
    it('sends one inline-image request to the requested model with structured output', async () => {
        const { service, generateContent, clientFactory } = setup()
        await expect(service.extractEvent(image)).resolves.toEqual(fields)
        expect(clientFactory).toHaveBeenCalledWith('test-key')
        expect(generateContent).toHaveBeenCalledTimes(1)
        expect(generateContent).toHaveBeenCalledWith(expect.objectContaining({
            model: 'gemini-3.5-flash-lite',
            config: expect.objectContaining({ responseMimeType: 'application/json', responseJsonSchema: expect.objectContaining({ required: Object.keys(fields) }) }),
            contents: [expect.objectContaining({ parts: [
                expect.objectContaining({ text: expect.any(String) }),
                { inlineData: { mimeType: 'image/png', data: image.buffer.toString('base64') } },
            ] })],
        }))
    })

    it('preserves empty fields without inventing missing information', async () => {
        const empty = { ...Object.fromEntries(['title', 'description', 'date', 'time', 'location'].map((key) => [key, ''])), eventStatus: 'uncertain', eventStatusReason: '' }
        await expect(setup(JSON.stringify(empty)).service.extractEvent(image)).resolves.toEqual(empty)
    })

    it.each(['likely_event', 'uncertain', 'not_event'])('returns %s classification in the same single request', async (eventStatus) => {
        const result = { ...fields, eventStatus }
        const { service, generateContent } = setup(JSON.stringify(result))
        await expect(service.extractEvent(image)).resolves.toEqual(result)
        expect(generateContent).toHaveBeenCalledTimes(1)
    })

    it('does not call Gemini without a configured key', async () => {
        const { service, generateContent } = setup()
        vi.stubEnv('GEMINI_API_KEY', '')
        await expect(service.extractEvent(image)).rejects.toMatchObject({ statusCode: 503 })
        expect(generateContent).not.toHaveBeenCalled()
    })

    it.each([
        'not JSON', '{}',
        JSON.stringify({ ...fields, date: '2026-02-30' }),
        JSON.stringify({ ...fields, date: '10/20/2026' }),
        JSON.stringify({ ...fields, time: '14:30' }),
        JSON.stringify({ ...fields, extra: 'unexpected' }),
        JSON.stringify({ ...fields, eventStatus: 'unknown' }),
        JSON.stringify({ ...fields, eventStatusReason: 'x'.repeat(241) }),
        JSON.stringify({ ...fields, eventStatus: undefined }),
    ])('rejects invalid model output: %s', async (text) => {
        await expect(setup(text).service.extractEvent(image)).rejects.toMatchObject({ statusCode: 502, code: 'AI_INVALID_RESPONSE' })
    })

    it.each([429, 503])('sanitizes provider errors without retrying HTTP %s', async (status) => {
        const { service, generateContent } = setup()
        generateContent.mockRejectedValue({ status, message: 'secret request data' })
        const expectedStatus = status === 429 ? 429 : 502
        await expect(service.extractEvent(image)).rejects.toMatchObject({ statusCode: expectedStatus })
        expect(generateContent).toHaveBeenCalledTimes(1)
    })

    it('disables retries in the real SDK, including on HTTP 503', async () => {
        vi.stubEnv('GEMINI_API_KEY', 'test-key')
        const fetch = vi.fn().mockImplementation(() => Promise.resolve(new Response(JSON.stringify({ error: { code: 503, message: 'Unavailable' } }), {
            status: 503, headers: { 'content-type': 'application/json' },
        })))
        vi.stubGlobal('fetch', fetch)
        await expect(createEventExtractionService().extractEvent(image)).rejects.toMatchObject({ statusCode: 502 })
        expect(fetch).toHaveBeenCalledTimes(1)
    })
})
