import dotenv from "dotenv";
import {MySqlContainer} from "@testcontainers/mysql";
import {runMigrations} from "../utils/migrateContainer.mjs";
import {RedisContainer} from "@testcontainers/redis";
import {generatePublicKey, Oprf, randomPrivateKey} from "@cloudflare/voprf-ts";
import {Base64} from "js-base64";

dotenv.config({ path: ".env.test" });

process.env.NODE_ENV ||= "test";

let sqlContainer
let redisContainer

export async function setup() {
    sqlContainer = await new MySqlContainer("mysql:8.0.36")
        .withDatabase("testdb")
        .withUsername("test")
        .withUserPassword("test")
        .start()
    redisContainer = await new RedisContainer("redis:8.6.1").start()

    const url = sqlContainer.getConnectionUri()
    process.env.DATABASE_URL = url
    process.env.REDIS_URL = redisContainer.getConnectionUrl()
    await runMigrations(url, "up")



}

export async function teardown(){
    redisContainer.stop()
    sqlContainer.stop()
}
