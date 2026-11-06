import { AppError } from './appError.mjs'

export class TooManyRequestsError extends AppError {
    constructor(data = null, message = 'Too many requests') {
        super(message, 429, 'TOO_MANY_REQUESTS', data)
    }
}