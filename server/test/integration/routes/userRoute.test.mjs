import { describe, it, expect,afterEach, beforeAll,afterAll, beforeEach} from 'vitest'
import { createUserService } from '../../../src/services/users/userService.mjs'
import { createUsernameService } from '../../../src/services/users/usernameGenerator.mjs'
import { createUserRepo } from '../../../src/repositories/userRepository.mjs'
import {setupSQL} from "../../utils/containerSetup.mjs";
import {createRandomUser, seedUsers} from "../../seed.mjs";
import {createApp} from "../../../src/app/app.mjs";
import request from "supertest";
import {createJWTTokenService} from "../../../src/services/auth/jwt/jwtTokenService.mjs";

describe("userRoute Integration", () => {
    let connectionPool
    let app
    let userRepo
    let users
    let userService
    let usernameService
    let jwtTokenService
    let connection
    beforeAll(async () => {
        connectionPool = await setupSQL()
        userRepo = createUserRepo(connectionPool)
        users = await seedUsers(userRepo, 10)
    }, 30000)

    beforeEach(async () => {
        connection = await connectionPool.getConnection()
        app = createApp(connection)
        userService = createUserService({userRepo, usernameService})
        jwtTokenService = createJWTTokenService()
        await connection.beginTransaction()
    })

    afterEach(async () => {
        connection.rollback()
        connection.release()
    })

    describe("userRoute", () => {
        it("GET /user/me get login user resource", async () => {

        })
    })


})
