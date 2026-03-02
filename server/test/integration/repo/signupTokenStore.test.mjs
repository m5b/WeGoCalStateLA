import {afterEach, beforeAll, beforeEach, describe, expect, it} from "vitest";
import {setupRedis} from "../../utils/containerSetup.mjs";
import {createRandomOtp} from "../../seed.mjs";
import {redisKeysConfig} from "../../../src/config/redisKeysConfig.mjs";
import {buildRedisKey} from "../../../src/util/redisKeyBuilder.mjs";
import Redis from "ioredis";
import {redisConfig} from "../../../src/config/redisConfig.mjs";
import {ServiceUnavailable} from "../../../src/errors/serviceUnavailable.mjs";
import {UnauthorizedError} from "../../../src/errors/unauthorizedError.mjs";
import {createSignupTokenStore} from "../../../src/repositories/redis/signupTokenStore.mjs";
import {faker} from "@faker-js/faker";
import {generateKey} from "../../../src/services/auth/otp/keyGenerator.mjs";

describe("signupTokenStore Integration", () => {
    let signupTokenStore
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
        signupTokenStore = createSignupTokenStore({redis, signupTokenPrefix: redisKeysConfig.signupToken, opt})
    })
    describe("signupTokenStore .save", () => {
        it("save the signupToken", async () => {
            for(let i = 0; i < count; i++){
                const email = faker.internet.email()
                const verifiedMethod = "otp"
                const key = generateKey(32)
                await signupTokenStore.save(key, {email, verifiedMethod})
                const prefixKey = buildRedisKey(redisKeysConfig.signupToken, key)
                const verify = await redis.hgetall(prefixKey)
                const seconds = await redis.ttl(prefixKey);
                expect(verify.email).toBe(email)
                expect(verify.verifiedMethod).toBe(verifiedMethod)
                expect(verify.createdAt).not.toBeNull()
                expect(seconds).toBeLessThanOrEqual(opt.ttl)
            }

        })
        it("throws ServiceUnavailable when redis is down", async () => {
            await redis.quit()
            const key = generateKey(32)
            const email = faker.internet.email()
            const verifiedMethod = "otp"
            await expect(signupTokenStore.save(key, {
                email, verifiedMethod
            })).rejects.toBeInstanceOf(ServiceUnavailable)

            await expect(signupTokenStore.save(key, {
                email, verifiedMethod
            })).rejects.toThrow("Signup service is temporarily unavailable. Please try again later.");
        })
    })
    describe("signupTokenStore.consume", () => {
        it("return the signupToken", async () => {
            for(let i = 0; i < count; i++){
                const key = generateKey(32)
                const email = faker.internet.email()
                const verifiedMethod = "otp"
                await signupTokenStore.save(key, {
                    email, verifiedMethod
                })
                const verify = await signupTokenStore.consume(key)
                expect(verify.email).toBe(email)
                expect(verify.verifiedMethod).toBe(verifiedMethod)
                expect(verify.createdAt).not.toBeNull()
                //deleted
                await expect(signupTokenStore.consume(key)).rejects.toBeInstanceOf(UnauthorizedError)
                await expect(signupTokenStore.consume(key))
                    .rejects.toThrow("Sign up session expired. Please try again");

            }
        })
        it("throws ServiceUnavailable when redis is down", async () => {
            const key = generateKey(32)
            const email = faker.internet.email()
            const verifiedMethod = "otp"
            await signupTokenStore.save(key, {
                email, verifiedMethod
            })
            await redis.quit()
            await expect(signupTokenStore.consume(key)).rejects.toBeInstanceOf(ServiceUnavailable)
            await expect(signupTokenStore.consume(key))
                .rejects.toThrow("Signup service is temporarily unavailable. Please try again later.");
        })
        it("throw UnauthorizedError when key can not found", async () => {
            const {key, otpVal} = await createRandomOtp()
            await expect(signupTokenStore.consume(key)).rejects.toBeInstanceOf(UnauthorizedError)
            await expect(signupTokenStore.consume(key))
                .rejects.toThrow("Sign up session expired. Please try again");
        })

    })



    afterEach(async () => {
        if(redis.status === 'end') return
        await redis.flushdb();
    })




})
