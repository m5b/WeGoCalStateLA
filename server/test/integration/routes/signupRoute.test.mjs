import {afterEach, beforeAll, beforeEach, describe, expect, it, vi} from "vitest";
import {setupRedis, setupSQL} from "../../utils/containerSetup.mjs";
import Redis from "ioredis";
import {redisConfig} from "../../../src/config/redisConfig.mjs";
import {createApp} from "../../../src/app/app.mjs";
import request, {cookies} from "supertest";
import {faker} from "@faker-js/faker";
import {createUserRepo} from "../../../src/repositories/userRepository.mjs";
import dbMapper from "../../../src/util/dbMapper.mjs";

describe("signupRoute", () => {
    let redis
    let redisConnectionUrl
    let sqlPool
    let lastOtp = null;
    const emailService = {
        sendOTPEmail: vi.fn(async (_email, otpCode) => {
            lastOtp = otpCode;
        }),
    };
    beforeAll(async () => {
        redisConnectionUrl = await setupRedis()
        sqlPool = await setupSQL()
    }, 30000)
    let connection
    let app
    let agent
    beforeEach(async () => {
        emailService.sendOTPEmail.mockClear()
        lastOtp = null
        connection = await sqlPool.getConnection()
        redis = new Redis(redisConnectionUrl, redisConfig.option)
        app = createApp(connection, redis, emailService)
        agent = request.agent(app)
        await connection.beginTransaction()
    })
    afterEach(async () => {

        connection.rollback()
        connection.release()
        if(redis.status === 'end') return
        await redis.flushdb();
        await redis.quit()

    })
    describe("/api/auth/signup", () => {
        it("returns 200 and created the user", async () => {
            //get otp first
            const email = faker.internet.email()
            const password = "Wegoapp123456!"
            const res1 = await agent
                .post("/api/auth/otp/send")
                .send({ email})
                .expect('Content-Type', /json/)
                .expect(200)
            //verify the otp
            const res2 = await agent
                .post("/api/auth/otp/verify")
                .send({otp: lastOtp})
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(cookies.set({name: "signup_tx", options: ["path", "httponly", "samesite"]}))
            const userRepo= createUserRepo(connection)
            const userCount = await userRepo.getCount()
            const res3 = await agent
                .post("/api/auth/signup")
                .send({password})
                .expect('Content-Type', /json/)
                .expect(200)
            expect(await userRepo.getCount()).toBe(userCount + 1)
            expect(dbMapper.fromDb(await userRepo.findByUuid(res3.body.data.userUuid)).userUuid).toBe(res3.body.data.userUuid)

        })

        it("return 400 and validation error when password don't match the format", async () => {
            const email = faker.internet.email()
            const password = "Wegoapp123456"
            const res1 = await agent
                .post("/api/auth/otp/send")
                .send({ email})
                .expect('Content-Type', /json/)
                .expect(200)
            //verify the otp
            const res2 = await agent
                .post("/api/auth/otp/verify")
                .send({otp: lastOtp})
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(cookies.set({name: "signup_tx", options: ["path", "httponly", "samesite"]}))
            const res3 = await agent
                .post("/api/auth/signup")
                .send({password})
                .expect('Content-Type', /json/)
                .expect(400)
            expect(res3.body.status).toBe("fail")
            expect(res3.body.data).toHaveProperty("password")

        })
        it("return 400 and validation error when extra field is there", async () => {
            const email = faker.internet.email()
            const password = "Wegoapp123456!"
            const res1 = await agent
                .post("/api/auth/otp/send")
                .send({ email})
                .expect('Content-Type', /json/)
                .expect(200)
            //verify the otp
            const res2 = await agent
                .post("/api/auth/otp/verify")
                .send({otp: lastOtp})
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(cookies.set({name: "signup_tx", options: ["path", "httponly", "samesite"]}))
            const res3 = await agent
                .post("/api/auth/signup")
                .send({password, something: "a"})
                .expect('Content-Type', /json/)
                .expect(400)

        })
        it("return 401 due to no required cookie", async () => {
            const email = faker.internet.email()
            const password = "Wegoapp123456!"

            const res3 = await agent
                .post("/api/auth/signup")
                .send({password})
                .expect('Content-Type', /json/)
                .expect(401)
            expect(res3.body.status).toBe("fail")
            expect(res3.body.data).toHaveProperty("signup_tx")
        })

        it("return 503 and due to redis down", async () => {
            const email = faker.internet.email()
            const password = "Wegoapp123456!"
            const res1 = await agent
                .post("/api/auth/otp/send")
                .send({ email})
                .expect('Content-Type', /json/)
                .expect(200)
            //verify the otp
            const res2 = await agent
                .post("/api/auth/otp/verify")
                .send({otp: lastOtp})
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(cookies.set({name: "signup_tx", options: ["path", "httponly", "samesite"]}))
            const userRepo= createUserRepo(connection)
            const userCount = await userRepo.getCount()
            await redis.quit()
            const res3 = await agent
                .post("/api/auth/signup")
                .send({password})
                .expect('Content-Type', /json/)
                .expect(503)
            expect(res3.body.status).toBe("fail")

        })
    })
})
