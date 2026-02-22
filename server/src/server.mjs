import express from 'express'
import * as https from 'node:https'
import 'dotenv/config'
import router from './routes/index.mjs'
import cookieParser from 'cookie-parser'
import errorHandler from './middlewares/errorHandler.mjs'
import cors from 'cors'
import { corsConfig } from './config/corsConfig.mjs'
import * as fs from 'node:fs'

const app = express()
const sslOption = {
    key: fs.readFileSync('./localhost-key.pem', "utf-8"),
    cert: fs.readFileSync('./localhost.pem', "utf-8")
}
//using this middleware allow express to parase the incoming request with json req.body
app.use(cors(corsConfig))
app.use(express.json())
app.use(cookieParser())
app.use('/api', router)
app.use(errorHandler)

https.createServer(sslOption, app).listen(
    process.env.PORT || 3000
)
