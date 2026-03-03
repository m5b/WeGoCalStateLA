import {afterEach, beforeAll, beforeEach, describe, expect, it, vi} from "vitest";
import {setupRedis, setupSQL} from "../../utils/containerSetup.mjs";
import Redis from "ioredis";
import {redisConfig} from "../../../src/config/redisConfig.mjs";
import {createApp} from "../../../src/app/app.mjs";
import request, {cookies} from "supertest";
import {faker} from "@faker-js/faker";

describe("emailOTP route", () => {
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

    describe("googleAuthRoute Integration", () => {
        describe("GET /api/auth/google", () => {
            it("redirect user and set the cookie", async () => {
                const res = await agent
                    .get("/api/aut/google")
                    .expect(302)
                    .expect(cookies.set({ name: "otp_tx", options: ["path", "httponly", "samesite"] }))
            })
        })
    })

})
