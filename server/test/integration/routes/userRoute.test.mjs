import { describe, it, expect,afterEach, beforeAll,afterAll, beforeEach} from 'vitest'
import { createUserService } from '../../../src/services/userService.mjs'
import { createUsernameService } from '../../../src/services/usernameGenerator.mjs'
import { createUserRepo } from '../../../src/repositories/userRepository.mjs'
import {setupSQL} from "../../containerSetup.mjs";
import {createRandomUser, seedUsers} from "../../seed.mjs";
import {createApp} from "../../../src/app/app.mjs";

describe("userRoute Integration", () => {
    let connectionPool
    let app
    let userRepo
    let users
    let userService
    let usernameService
    let connection
    beforeAll(async () => {
        connectionPool = await setupSQL()
        userRepo = createUserRepo(connectionPool)
        users = await seedUsers(userRepo, 10)
        app = createApp()
    }, 30000)

    beforeEach(async () => {
        connection = await connectionPool.getConnection()
        userRepo = createUserRepo(connection)
        usernameService = createUsernameService(userRepo)
        userService = createUserService({userRepo, usernameService})
        await connection.beginTransaction()
    })

    afterEach(async () => {
        connection.rollback()
        connection.release()
    })



})
