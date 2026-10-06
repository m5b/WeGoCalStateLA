import { AppError } from './appError.mjs'

export class ForbiddenError extends AppError {
    constructor(data = null, message = 'Forbidden') {
        super(message, 403, 'FORBIDDEN', data)
    }
}