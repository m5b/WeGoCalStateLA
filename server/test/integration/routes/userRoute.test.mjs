import { describe, it, expect,afterEach, beforeAll,afterAll, beforeEach} from 'vitest'
import { createUserService } from '../../../src/services/users/userService.mjs'
import {createApp} from "../../../src/app/app.mjs";
import {createJWTTokenService} from "../../../src/services/auth/jwt/jwtTokenService.mjs";
import {createPool} from "mysql2/promise";
import {seedUsers} from "../../seed.mjs";

describe("userRoute Integration", () => {
    let sqlPool
    let app
    let userRepo
    let users
    let userService
    let usernameService
    let jwtTokenService
    let connection
    beforeAll(async () => {
        sqlPool = createPool(process.env.DATABASE_URL)
        users = global.users
    }, )

    beforeEach(async () => {
        connection = await sqlPool.getConnection()
        app = createApp(connection)
        userService = createUserService({userRepo, usernameService})
        jwtTokenService = createJWTTokenService()
        await connection.beginTransaction()
    })

    afterEach(async () => {
        await connection.rollback()
        connection.release()
    })
    afterAll(async ()=> {
        await sqlPool.end()
    })

    describe("userRoute", () => {
        it("GET /user/me get login user resource", async () => {

        })
    })


})
