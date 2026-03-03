import {afterAll, afterEach, beforeAll, beforeEach, describe, expect, it} from "vitest";
import {setupRedis} from "../../utils/containerSetup.mjs";
import Redis from "ioredis";
import {redisConfig} from "../../../src/config/redisConfig.mjs";
import {createOTPStore} from "../../../src/repositories/redis/otpStore.mjs";
import {redisKeysConfig} from "../../../src/config/redisKeysConfig.mjs";
import {UnauthorizedError} from "../../../src/errors/unauthorizedError.mjs";
import {createOTPService} from "../../../src/services/auth/otp/otpService.mjs";
import {createJWTTokenService} from "../../../src/services/auth/jwt/jwtTokenService.mjs";
import {faker} from "@faker-js/faker";
import bcrypt from "bcrypt";

describe("otpService Integration", () => {
    let otpStore
    let otpService
    let jwtTokenService= createJWTTokenService()
    let redis
    let count = 10
    let connectionURL
    let round = 10
    let opt = {
        ttl: 300
    }
    const dbIndex = Number(process.env.VITEST_POOL_ID)
    const redisOption = {...redisConfig.option, db:dbIndex}
    beforeEach(() => {
        redis = new Redis(process.env.REDIS_URL, redisOption)
        otpStore = createOTPStore({redis, otpPrefix: redisKeysConfig.otp})
        otpService = createOTPService({
            otpStore,
            jwtTokenService,
            round
        })
    })
    afterAll(async ()=> {
        if(redis.status === 'end') return
        redis.quit()
    })
    afterEach(async () => {
        if(redis.status === 'end') return
        await redis.flushdb();
    })
    describe("otpService.saveOTP", () => {
        it("save the otp", async () => {
            for(let i = 0; i < count; i++){
                const email = faker.internet.email()
                const {key, token, otpCode} = await otpService.saveOTP(email)
                const otpVal = await otpStore.consume(key)
                expect(await bcrypt.compare(otpCode, otpVal.otpCodeHash)).toBeTruthy()
                expect(otpVal).not.toBeNull()
                expect(otpVal.email).toBe(email)
                expect(otpVal.attempts).toBe("0")
                expect(otpVal.createdAt).not.toBeNull()
            }

        })
    })
    describe("otpService.verifyOTP", () => {
        it("verify the otp", async () => {
            const email = faker.internet.email()
            const {key, token, otpCode} = await otpService.saveOTP(email)
            await otpService.verifyOTP(key, otpCode)
            await expect(otpService.verifyOTP(key, otpCode)).rejects.toBeInstanceOf(UnauthorizedError)

        })
    })








})
