import { Router } from 'express'
import multer from 'multer'
import { requireAuth } from '../middlewares/requireAuth.mjs'
import { AppError } from '../errors/appError.mjs'
import { BadRequestError } from '../errors/badRequestError.mjs'
import { jsend } from '../util/jSend.mjs'

const imageTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024, files: 1, fields: 0, parts: 2 },
    fileFilter(req, file, callback) {
        if (!imageTypes.has(file.mimetype)) {
            return callback(new AppError('Use a JPEG, PNG, or WebP flyer.', 415, 'AI_UNSUPPORTED_IMAGE'))
        }
        callback(null, true)
    },
}).single('image')

function uploadFlyer(req, res, next) {
    if (!req.is('multipart/form-data')) {
        return next(new BadRequestError(null, 'Send the flyer as multipart/form-data in the image field.'))
    }
    upload(req, res, (error) => {
        if (!error) return next()
        if (error instanceof AppError) return next(error)
        if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
            return next(new AppError('The flyer must be 5 MB or smaller.', 413, 'AI_IMAGE_TOO_LARGE'))
        }
        next(new BadRequestError(null, 'Send exactly one flyer image in the image field, with no other fields.'))
    })
}

function matchesImageType({ buffer, mimetype }) {
    if (mimetype === 'image/jpeg') return buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))
    if (mimetype === 'image/png') return buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
    return buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP'
}

export function createAIRouter({ userService, eventExtractionService }) {
    const router = Router()
    router.post('/extract-event', requireAuth(userService), uploadFlyer, async (req, res) => {
        if (!req.file || req.file.size === 0) {
            throw new BadRequestError(null, 'Select a flyer image first.')
        }
        if (!matchesImageType(req.file)) {
            throw new AppError('The uploaded file does not match its image type.', 415, 'AI_UNSUPPORTED_IMAGE')
        }
        const event = await eventExtractionService.extractEvent(req.file)
        res.set('Cache-Control', 'no-store')
        res.json(jsend.success(event))
    })
    return router
}
