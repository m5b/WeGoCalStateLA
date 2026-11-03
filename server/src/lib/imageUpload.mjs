import multer from 'multer'
import { BadRequestError } from '../errors/badRequestError.mjs'
import { IMAGE_EXTENSIONS } from './imageTypes.mjs'

// Photos are held in memory (up to 8 MB) and saved by the service that owns them. Only real
// picture types are accepted, since uploads are served back to browsers from /api/uploads.
export function createImageUpload() {
    return multer({
        storage: multer.memoryStorage(),
        limits: { fileSize: 8 * 1024 * 1024 },
        fileFilter(req, file, callback) {
            if (!IMAGE_EXTENSIONS[file.mimetype]) {
                return callback(new BadRequestError(null, 'Use a JPEG, PNG, WebP, or GIF image.'))
            }
            callback(null, true)
        },
    })
}