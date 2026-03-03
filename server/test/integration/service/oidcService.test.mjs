import {beforeAll, beforeEach, describe, expect, it, vi} from "vitest";
import {createJWTTokenService} from "../../../src/services/auth/jwt/jwtTokenService.mjs";
import {setupRedis} from "../../utils/containerSetup.mjs";
import Redis from "ioredis";
import {redisConfig} from "../../../src/config/redisConfig.mjs";
import {redisKeysConfig} from "../../../src/config/redisKeysConfig.mjs";
import {createOIDCStore} from "../../../src/repositories/redis/oidcStore.mjs";
import {createOIDCService} from "../../../src/services/auth/oidc/oidcService.mjs";
import {openIdClient} from "../../../src/lib/openIdClient.mjs";
import {openIdConfig} from "../../../src/config/openIdConfig.mjs";
import * as client from "openid-client";
import {faker} from "@faker-js/faker";
import {ServiceUnavailable} from "../../../src/errors/serviceUnavailable.mjs";

describe("oidcTokenStore Integration", () => {
    let oidcStore
    let oidcService
    let jwtTokenService = createJWTTokenService()
    let redis
    let count = 10
    let connectionURL
    let round = 10
    let opt = {
        ttl: 300
    }
    beforeAll(async () => {
        connectionURL = await setupRedis()
    }, 30000)

    beforeEach(() => {
        redis = new Redis(connectionURL, redisConfig.option)
        oidcStore = createOIDCStore({redis, oidcPrefix: redisKeysConfig.oidc})
        oidcService = createOIDCService({
            oidcStore,
            jwtTokenService,
            openIdClient: openIdClient.googleClient,
            openIdConfig,
            provider: "google"
        })
    })
    describe("oidcService.startOIDCSignup", () => {
        it("return the token and url without the error", async () => {
            const {token, redirectURL} = await oidcService.startOIDCSignup()
            expect(token).not.toBeNull()
            expect(redirectURL).not.toBeNull()
        })
        it("thrown the ServiceUnavaliable due to redis down", async () => {
            await redis.quit()
            await expect(oidcService.startOIDCSignup()).rejects.toBeInstanceOf(ServiceUnavailable)
        })
    })
    describe("oidcService.completeOIDCSignup", () => {
        it("complete signup and return email", async () => {
            const email = faker.internet.email()
            vi.mock('openid-client', async (importOriginal) => {
                const actual = await importOriginal();
                return {
                    ...actual,
                    authorizationCodeGrant: vi.fn(),
                };
            });
            client.authorizationCodeGrant.mockResolvedValue({
                claims: () => ({email: email})
            })
            const {key, redirectURL} = await oidcService.startOIDCSignup()
            const verify = await oidcService.completeOIDCSignup(key, redirectURL)
            expect(email).toBe(verify)
        })
        it("thrown the ServiceUnavaliable due to redis down", async () => {
            const {key, redirectURL} = await oidcService.startOIDCSignup()
            await redis.quit()
            await expect(oidcService.completeOIDCSignup(key, redirectURL)).rejects.toBeInstanceOf(ServiceUnavailable)
        })
    })
})
