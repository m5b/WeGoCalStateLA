import getErrorMessage from '../util/getErrorMessage.mjs'
import { AppError } from '../errors/appError.mjs'
import { jsend } from '../util/jSend.mjs'
export default function errorHandler(err, req, res, next) {
    //close the connection and print to stacktrace(if not in production)
    if (res.headersSend) {
        return next(err)
    }
    //check for custom error
    if (err instanceof AppError) {
        return res
            .status(err.statusCode)
            .json(jsend.fail(err.data, err.message))
    }
    if (process.env.NODE_ENV === 'development') {
        console.log(err)
    }
    return res.status(500).json(jsend.error(getErrorMessage(err)))
}
