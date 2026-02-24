import "./config/loadEnv.mjs"
import express from 'express'
import * as https from 'node:https'
import router from './routes/index.mjs'
import cookieParser from 'cookie-parser'
import errorHandler from './middlewares/errorHandler.mjs'
import cors from 'cors'
import { corsConfig } from './config/corsConfig.mjs'
import * as fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import connectionPool from './lib/pool.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const keyPath = path.join(__dirname, '../certs/localhost-key.pem')
const certPath = path.join(__dirname, '../certs/localhost.pem')

const app = express()
const sslOption = {
    key: fs.readFileSync(keyPath, "utf-8"),
    cert: fs.readFileSync(certPath, "utf-8")
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
