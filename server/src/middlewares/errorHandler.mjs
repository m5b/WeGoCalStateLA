import getErrorMessage from '../util/getErrorMessage.mjs'
import { AppError } from '../errors/appError.mjs'
import { jsend } from '../util/jSend.mjs'
import { ZodError } from 'zod'
export default function errorHandler(err, req, res, next) {
    //close the connection and print to stacktrace(if not in production)
    if (res.headersSend) {
        return next(err)
    }

    if (err instanceof ZodError) {
        const data = {}
        err.issues.forEach((issue) => {
            data[issue[path[0]]] = issue.message
        })
        return res.status(400).json(jsend.fail(data, 'Validation Error'))
    }
    if (err instanceof AppError) {
        //check for custom error
        return res
            .status(err.statusCode)
            .json(jsend.fail(err.data, err.message))
    }
    if (process.env.NODE_ENV === 'development') {
        console.log(err)
    }
    return res.status(500).json(jsend.error(getErrorMessage(err)))
}
