import cors from 'cors'
import { corsConfig } from '../config/corsConfig.mjs'
import express from 'express'
import cookieParser from 'cookie-parser'
import router from '../routes/index.mjs'
import errorHandler from '../middlewares/errorHandler.mjs'

export function createApp(){
    const app = express()
    app.use(cors(corsConfig))
    app.use(express.json())
    app.use(cookieParser())
    app.use('/api', router)
    app.use(errorHandler)
    return app
}
