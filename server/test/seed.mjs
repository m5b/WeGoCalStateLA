import { faker } from '@faker-js/faker'
import { hkdf } from '../src/util/hash.mjs'
import bcrypt from 'bcrypt'
import {uint8ArrayToBase64UrlString} from "../src/util/encoding.mjs";
import crypto from "crypto";

export async function createRandomUser() {
    const username = faker.internet.username()
    const user = {
        userUuid: faker.string.uuid(),
        username,
        displayName: username,
        emailHash: hkdf(faker.internet.email()),
        passwordHash: await bcrypt.hash(faker.internet.password(), 12),
    }
    return user
}

export function createRandomThread(userId){
    const thread = {
        userId: userId,
        threadUuid: faker.string.uuid(),
        title: faker.lorem.sentence(10),
        content: faker.lorem.paragraph(20)
    }
    return thread
}

export async function createRandomOtp() {
    const key = uint8ArrayToBase64UrlString(crypto.randomBytes(32))
    const code = faker.string.numeric({length: 6, allowLeadingZeros: true})
    const otpVal = {
        otpCodeHash: await bcrypt.hash(code, 10),
        email: faker.internet.email()
    }
    return {key, otpVal}
}

export async function seedUsers(db, count){
    const users = []
    for(let i = 0; i < count; i++){
        const user = await createRandomUser()
        const userId = await db.insertUser(user)
        users.push({...user, userId})
    }
    return users
}

export async function seedThreads(users, db, perUser){
    const threads = []
    for(const user of users){
        for(let i = 0; i < perUser; i++){
            const thread = createRandomThread(user.userId)
            await db.insertThread(thread)

        }
    }

}