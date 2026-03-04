import {afterAll, afterEach, beforeAll, beforeEach, describe, expect, it} from "vitest";
import {createJWTTokenService} from "../../../src/services/auth/jwt/jwtTokenService.mjs";
import {createLoginTokenStore} from "../../../src/repositories/redis/loginTokenStore.mjs";
import {createSignupTokenService} from "./loginTokenService.test.mjs";
import {redisConfig} from "../../../src/config/redisConfig.mjs";
import {createLoginTokenService} from "../../../src/services/auth/login/loginTokenService.mjs";

describe("loginToken Integration", () => {
    let loginTokenStore
    let loginTokenService
    let jwtTokenService= createJWTTokenService()
    let redis
    let count = 10
    let round = 10
    let opt = {
        ttl: 300
    }
    const dbIndex = Number(process.env.VITEST_POOL_ID)
    const redisOption = {...redisConfig.option, db:dbIndex}
    beforeEach(() => {
        redis = new Redis(process.env.REDIS_URL, redisOption)
        loginTokenStore = createLoginTokenStore({redis, loginTokenPrefix: redisKeysConfig.loginToken})
        loginTokenService= createLoginTokenService({
            loginTokenStore,
            jwtTokenService,
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
    describe("signupTokenService.saveSignupToken", () => {
        it("save the signupToken", async () => {
            for(let i = 0; i < count; i++){
                const email = faker.internet.email()
                const verifiedMethod = "otp"
                const {key, token} = await signupTokenService.saveSignupToken(email, verifiedMethod)
                const val = await loginTokenStore.consume(key)

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

        it("throw unauthorized error due not found", async () => {
            await expect(signupTokenService.verifySignupToken("coolkey")).rejects.toBeInstanceOf(UnauthorizedError)
        })

    })
})
