import "./config/loadEnv.mjs"
import * as https from 'node:https'
import * as fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createApp } from './app/app.mjs'
import connectionPool from "./lib/pool.mjs";
import {redis} from "./lib/redis.mjs";
import {createEmailService} from "./services/auth/email/emailService.mjs";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const keyPath = path.join(__dirname, '../certs/localhost-key.pem')
const certPath = path.join(__dirname, '../certs/localhost.pem')
const emailService = createEmailService()
const app = createApp(connectionPool, redis, emailService)
const sslOption = {
    key: fs.readFileSync(keyPath, "utf-8"),
    cert: fs.readFileSync(certPath, "utf-8")
}

https.createServer(sslOption, app).listen(
    process.env.PORT || 3000
)
