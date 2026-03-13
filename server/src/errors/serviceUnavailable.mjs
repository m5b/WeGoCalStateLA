import { AppError } from './appError.mjs'

export class ServiceUnavailable extends AppError {
    constructor(data = null, message = 'Service Unavailable') {
<<<<<<< HEAD
        super(message, 503, 'SERVICE_UNAVAILABLE', data)
=======
        super(message = "", 503, 'SERVICE_UNAVAILABLE', data)
>>>>>>> abcb6e26 (message)
    }
}
