import {afterEach, beforeAll, beforeEach, describe, expect, it} from "vitest";
import {setupRedis} from "../../utils/containerSetup.mjs";
import {createRandomOtp} from "../../seed.mjs";
import {createOTPStore} from "../../../src/repositories/redis/otpStore.mjs";
import {redisKeysConfig} from "../../../src/config/redisKeysConfig.mjs";
import {buildRedisKey} from "../../../src/util/redisKeyBuilder.mjs";
import Redis from "ioredis";
import {redisConfig} from "../../../src/config/redisConfig.mjs";
import {ServiceUnavailable} from "../../../src/errors/serviceUnavailable.mjs";
import {UnauthorizedError} from "../../../src/errors/unauthorizedError.mjs";

describe("otpStore Integration", () => {
    let otpStore
    let redis
    let count = 10
    let connectionURL
    let opt = {
        ttl: 300
    }
    beforeAll(async () => {
        connectionURL= await setupRedis()
    }, 30000)

    beforeEach(() => {
        redis = new Redis(connectionURL, redisConfig.option, opt)
        otpStore = createOTPStore({redis, otpPrefix: redisKeysConfig.otp})
    })
    describe("otpStore.save", () => {
        it("save the otp", async () => {
           for(let i = 0; i < count; i++){
               const {key, otpVal} = await createRandomOtp()
               await otpStore.save(key, otpVal)
               const prefixKey = buildRedisKey(redisKeysConfig.otp, key)
               const verify = await redis.hgetall(prefixKey)
               const seconds = await redis.ttl(prefixKey);
               expect(verify.email).toBe(otpVal.email)
               expect(verify.otpCodeHash).toBe(otpVal.otpCodeHash)
               expect(verify.attempts).toBe("0")
               expect(verify.createdAt).not.toBeNull()
               expect(seconds).toBeLessThanOrEqual(opt.ttl)
           }

        })
        it("throws ServiceUnavailable when redis is down", async () => {
            await redis.quit()
            const {key, otpVal} = await createRandomOtp()
            await expect(otpStore.save(key, otpVal)).rejects.toBeInstanceOf(ServiceUnavailable)
            await expect(otpStore.save(key, otpVal))
                .rejects.toThrow("Signup service is temporarily unavailable. Please try again later.");
        })
    })
    describe("otpStore.consume", () => {
        it("return the otpVal", async () => {
            for(let i = 0; i < count; i++){
                const {key, otpVal} = await createRandomOtp()
                await otpStore.save(key, otpVal)
                const verify = await otpStore.consume(key)
                expect(verify.email).toBe(otpVal.email)
                expect(verify.otpCodeHash).toBe(otpVal.otpCodeHash)
                expect(verify.attempts).toBe("0")
                expect(verify.createdAt).not.toBeNull()
            }
        })
        it("throws ServiceUnavailable when redis is down", async () => {
            const {key, otpVal} = await createRandomOtp()
            await otpStore.save(key, otpVal)
            await redis.quit()
            await expect(otpStore.consume(key)).rejects.toBeInstanceOf(ServiceUnavailable)
            await expect(otpStore.consume(key))
                .rejects.toThrow("Signup service is temporarily unavailable. Please try again later.");
        })
        it("throw UnauthorizedError when key can not found", async () => {
            const {key, otpVal} = await createRandomOtp()
            await expect(otpStore.consume(key)).rejects.toBeInstanceOf(UnauthorizedError)
            await expect(otpStore.consume(key))
                .rejects.toThrow("OTP expired. Please try again");
        })

    })

    describe("otpStore.deleteOTP", () => {
        it("delete the key", async () => {
            for(let i = 0; i < count; i++){
                const {key, otpVal} = await createRandomOtp()
                await otpStore.save(key, otpVal)
                const verify = await otpStore.consume(key)
                expect(verify.email).toBe(otpVal.email)
                expect(verify.otpCodeHash).toBe(otpVal.otpCodeHash)
                expect(verify.attempts).toBe("0")
                expect(verify.createdAt).not.toBeNull()
                await otpStore.deleteOTP(key)
                await expect(otpStore.consume(key)).rejects.toBeInstanceOf(UnauthorizedError)
                await expect(otpStore.consume(key))
                    .rejects.toThrow("OTP expired. Please try again");
            }
        })
    })
    describe("otpStore.verifyOTPAttempts", () => {
        it("increment the otpAttempt", async () => {
            const {key, otpVal} = await createRandomOtp()
            await otpStore.save(key, otpVal)
            for(let i = 0; i < 5; i++){
                const otpVal = await otpStore.consume(key)
                expect(otpVal.attempts).toBe(String(i))
                await otpStore.verifyOTPAttempts(key, otpVal.attempts)
            }
            const otpVal2 = await otpStore.consume(key)
            expect(otpVal2.attempts).toBe(String(5))
            await expect(otpStore.verifyOTPAttempts(key, otpVal2.attempts)).rejects.toBeInstanceOf(UnauthorizedError)

        })
    })

    afterEach(async () => {
        if(redis.status === 'end') return
        await redis.flushdb();
    })




})
