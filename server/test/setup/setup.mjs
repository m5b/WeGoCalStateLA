import {runMigrations} from "../utils/migrateContainer.mjs";
import mysql from "mysql2/promise";

const DB_PREFIX=  "wegoapp"
const workerDBName = `${DB_PREFIX}_${process.env.VITEST_POOL_ID}`
const sqlUrl = `mysql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${workerDBName}`

const connection= await mysql.createConnection(
        {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD
        }
    )
await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${workerDBName}\``)
connection.end()
process.env.DATABASE_URL = sqlUrl
await runMigrations(sqlUrl, "up")
