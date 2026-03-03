import {
    describe,
    it,
    expect,
    afterEach,
    beforeAll,
    afterAll,
    beforeEach,
} from 'vitest'
import { MySqlContainer } from '@testcontainers/mysql'
import { createPool } from 'mysql2/promise'
import { runMigrations } from '../../utils/migrateContainer.mjs'
import { createUserRepo } from '../../../src/repositories/userRepository.mjs'
import dbMapper from '../../../src/util/dbMapper.mjs'
import { createRandomUser, seedUsers } from '../../seed.mjs'
import { createThreadRepo } from '../../../src/repositories/threadsRepository.mjs'



describe("userRepo Integration", () => {
    let sqlContainer
    let connectionPool
    let userRepo
    let threadRepo
    let connection
    let users
    beforeAll(async () => {
        connectionPool = await createPool(process.env.DATABASE_URL)

    }, )

    beforeEach(async () => {
        connection = await connectionPool.getConnection()
        userRepo = createUserRepo(connection)
        threadRepo = createThreadRepo(connection)
        await connection.beginTransaction()
    })

    afterEach(async () => {
        connection.rollback()
        connection.release()
    })

    afterAll(async() => {
        await connectionPool.end()
    })


})