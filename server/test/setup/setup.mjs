import {runMigrations} from "../utils/migrateContainer.mjs";
import mysql, {createConnection} from "mysql2/promise";
import {createUserRepo} from "../../src/repositories/userRepository.mjs";
import {seedUsers} from "../seed.mjs";

const DB_PREFIX=  "wegoapp"
const workerDBName = `${DB_PREFIX}_${process.env.VITEST_POOL_ID}`
const sqlUrl = `mysql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${workerDBName}`

let connection= await mysql.createConnection(
        {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD
        }
    )
//migration
await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${workerDBName}\``)
connection.end()
process.env.DATABASE_URL = sqlUrl
await runMigrations(sqlUrl, "up")
//seed
let connection2 = await createConnection(sqlUrl)
let userRepo = createUserRepo(connection2)
let users= await seedUsers(userRepo, 10)
global.users = users
connection2.end()
