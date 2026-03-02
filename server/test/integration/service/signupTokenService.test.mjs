import {afterEach, beforeAll, beforeEach, describe, expect, it} from "vitest";
import {setupRedis} from "../../utils/containerSetup.mjs";
import Redis from "ioredis";
import {redisConfig} from "../../../src/config/redisConfig.mjs";
import {createSignupTokenStore} from "../../../src/repositories/redis/signupTokenStore.mjs";
import {redisKeysConfig} from "../../../src/config/redisKeysConfig.mjs";
import {createJWTTokenService} from "../../../src/services/auth/jwt/jwtTokenService.mjs";
import {faker} from "@faker-js/faker";
import {createSignupTokenService} from "../../../src/services/auth/signup/signupTokenService.mjs";

describe("signupTokenService Integration", () => {
    let signupTokenStore
    let signupTokenService
    let jwtTokenService= createJWTTokenService()
    let redis
    let count = 10
    let connectionURL
    let round = 10
    let opt = {
        ttl: 300
    }
    beforeAll(async () => {
        connectionURL= await setupRedis()
    }, 30000)

    beforeEach(() => {
        redis = new Redis(connectionURL, redisConfig.option)
        signupTokenStore = createSignupTokenStore({redis, signupTokenPrefix: redisKeysConfig.otp})
        signupTokenService = createSignupTokenService({
            signupTokenStore,
            jwtTokenService,
        })
    })
    describe("signupTokenService.saveSignupToken", () => {
        it("save the signupToken", async () => {
            for(let i = 0; i < count; i++){
                const email = faker.internet.email()
                const verifiedMethod = "otp"
                const {key, token} = await signupTokenService.saveSignupToken(email, verifiedMethod)
                const val = await signupTokenStore.consume(key)

                expect(val).not.toBeNull()
                expect(val.email).toBe(email)
                expect(val.verifiedMethod).toBe(verifiedMethod)
                expect(val.createdAt).not.toBeNull()
            }

        })
    })
    describe("signupTokenService.verifySignupToken", () => {
        it("verify the signupToken", async () => {
            const email = faker.internet.email()
            const verifiedMethod = "otp"
            const {key, token} = await signupTokenService.saveSignupToken(email,verifiedMethod)
            const email2 = await signupTokenService.verifySignupToken(key)
            expect(email).toBe(email2)

        })
    })



    afterEach(async () => {
        if(redis.status === 'end') return
        await redis.flushdb();
    })




})
