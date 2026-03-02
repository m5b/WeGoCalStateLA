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
    let connectionURL
    let connection
    let users
    beforeAll(async () => {
        sqlContainer = await new MySqlContainer('mysql:8.0.36')
            .withDatabase('wegoapp')
            .withUsername('tester')
            .withUserPassword('123456')
            .start()
        connectionURL = sqlContainer.getConnectionUri()
        connectionPool = await createPool({
            uri: connectionURL,
        })
        await runMigrations(connectionURL, 'up')
        userRepo = createUserRepo(connectionPool)
        threadRepo = createThreadRepo(connectionPool)
        users = await seedUsers(userRepo, 10)

    }, 30000)

    beforeEach(async () => {
        connection = await connectionPool.getConnection()
        userRepo = createUserRepo(connection)
        await connection.beginTransaction()
    })

    afterEach(async () => {
        connection.rollback()
        connection.release()
    })

    afterAll(async () => {
        await sqlContainer.stop()
    })
}