import { describe, it, expect, vi, beforeEach, } from 'vitest'
import { createUserService } from '../../src/services/users/userService.mjs'
import { NotFoundError } from '../../src/errors/notFoundError.mjs'

describe("userService", () => {
    let userRepo, usernameService, userService
    beforeEach(
        () =>{
            usernameService= {
                generateUsername: vi.fn()
            }
            userRepo = {
                findByUserId: vi.fn(),
                insertUser: vi.fn(),
                findByEmailHash: vi.fn(),
                deleteByUserId: vi.fn(),
                findByUsername: vi.fn(),
                updateByUserId: vi.fn()
            }
            userService = createUserService({
                userRepo: userRepo,
                usernameService: usernameService
            })
        }

    )
    describe("userService.getByUserId", () => {

        it('return the user if userId exist', async () => {
            userRepo.findByUserId.mockResolvedValue({
                userId: 1,
                username: 'lazy-bird',
                displayName: 'lazy-bird'
            })
            const result = await userService.getByUserId(1)
            expect(userRepo.findByUserId).toBeCalledWith(1)
            expect(userRepo.insertUser).not.toBeCalled()
            expect(userRepo.deleteByUserId).not.toBeCalled()
            expect(result).toEqual({
                userId: 1,
                username: 'lazy-bird',
                displayName: 'lazy-bird'
            })
        })
        it('throw a NotFoundError if not find user base on given userId', async () => {
            userRepo.findByUserId.mockRejectedValue(
                new NotFoundError(
                    null,
                    'Can not found current user given the userId'
                )
            )
            const p = userService.getByUserId(1)
            expect(userRepo.insertUser).not.toBeCalled()
            expect(userRepo.deleteByUserId).not.toBeCalled()
            await expect(p).rejects.toBeInstanceOf(
                NotFoundError
            )
            await expect(p).rejects.toThrow(
                'Can not found current user given the userId'
            )

        })

    })

    describe("userService.createUser", () => {
        it("create the new user", async () => {
            userRepo.findByEmailHash.mockResolvedValue(null)
            userRepo.findByUsername.mockResolvedValue(null)
            usernameService.generateUsername.mockResolvedValue("unique-username")
            userRepo.insertUser.mockResolvedValue(1)
            userRepo.findByUserId.mockResolvedValue({
                userId:1,
                username: "unique-username",
                displayName: "unique-username",
            })
            const user = await userService.createUser("email-hash", "password-hash")
            expect(userRepo.findByEmailHash).toBeCalledWith("email-hash")
            expect(userRepo.insertUser).toBeCalledWith({emailHash: "email-hash", passwordHash: "password-hash", username: user.username})
            expect(userRepo.findByUserId).toBeCalledWith(1)
            expect(user).toEqual({
                userId:1,
                username: "unique-username",
                displayName: "unique-username"
            })

        })
        it("delete the user if user exist and create new one", async () => {
            userRepo.findByEmailHash.mockResolvedValue({
                userId: 1,
                username: "crazy-bird",
                displayName: "crazy-bird"
            })
            userRepo.deleteByUserId.mockResolvedValue(true)
            usernameService.generateUsername.mockResolvedValue("lazy-bird")
            userRepo.insertUser.mockResolvedValue(2)
            userRepo.findByUserId.mockResolvedValue({
                userId: 2,
                emailHash: "email-hash",
                username: "lazy-bird",
                displayName: "lazy-bird"
            })
            const user = await userService.createUser("email-hash", "password-hash")
            expect(userRepo.deleteByUserId).toBeCalledWith(1)
            expect(userRepo.insertUser).toBeCalledWith({
                emailHash: "email-hash",
                passwordHash: "password-hash",
                username: "lazy-bird"
            })
            expect(userRepo.findByUserId).toBeCalledWith(2)
            expect(user).toEqual({
                userId: 2,
                emailHash: 'email-hash',
                username: 'lazy-bird',
                displayName: 'lazy-bird',
            })
        })
    })

    describe("userService.getByUsername", ()=> {
        it("get the user with right username", async () => {
            userRepo.findByUsername.mockResolvedValue({
                userId : 1,
                username: "crazy-bird",
                displayName: "crazy-bird",
            })
            const user = await userService.getByUsername("crazy-bird")
            expect(userRepo.findByUsername).toBeCalledWith("crazy-bird")
            expect(userRepo.insertUser).not.toBeCalled()
            expect(userRepo.deleteByUserId).not.toBeCalled()
            expect(user).toEqual({
                userId: 1,
                username: 'crazy-bird',
                displayName: 'crazy-bird',
            })
        })
        it("throw an user if username not exist", async () => {
            userRepo.findByUsername.mockRejectedValue(
                new NotFoundError(
                    null,
                    'Can not found the user of given username'
                )
            )
            const p = userService.getByUsername("not-exist-name")
            await expect(p).rejects.toBeInstanceOf(
                NotFoundError
            )
            await expect(
                p
            ).rejects.toThrow('Can not found the user of given username')
            expect(userRepo.insertUser).not.toBeCalled()
            expect(userRepo.deleteByUserId).not.toBeCalled()
        })
    })

    describe("userService.getByEmailHash", () => {
        it('get the user with right emailHash', async () => {
            userRepo.findByEmailHash.mockResolvedValue({
                userId: 1,
                username: 'crazy-bird',
                displayName: 'crazy-bird',
            })
            const user = await userService.getByEmailHash('email-hash')
            expect(userRepo.findByEmailHash).toBeCalledWith('email-hash')
            expect(userRepo.insertUser).not.toBeCalled()
            expect(userRepo.deleteByUserId).not.toBeCalled()
            expect(user).toEqual({
                userId: 1,
                username: 'crazy-bird',
                displayName: 'crazy-bird',
            })
        })
        it('throw an user if emailHash not exist', async () => {
            userRepo.findByEmailHash.mockRejectedValue(
                new NotFoundError(
                    null,
                    'Can not found the user of given emailHash'
                )
            )
            const p = userService.getByEmailHash('not-exist-name')
            await expect(
                p
            ).rejects.toBeInstanceOf(NotFoundError)
            await expect(
                p
            ).rejects.toThrow('Can not found the user of given emailHash')
            expect(userRepo.insertUser).not.toBeCalled()
            expect(userRepo.deleteByUserId).not.toBeCalled()
        })
    })
    describe("userService.patchByUserId", () =>{
        it("update the user field successfully", async () => {
            const createdDate = Date.now()
            userRepo.updateByUserId.mockResolvedValue({existed: true, changed: true})
            userRepo.findByUserId.mockResolvedValue({
                userId: 1,
                username: "crazy-bird",
                displayName: "not a bird",
                createdDate: createdDate,
                updatedDate: createdDate
            })

            const user = await userService.patchByUserId(1, {
                displayName: "not a bird"
            })

            expect(userRepo.findByUserId).toBeCalledWith(1)
            expect(userRepo.updateByUserId).toBeCalledTimes(1)
            expect(userRepo.insertUser).not.toBeCalled()
            expect(userRepo.deleteByUserId).not.toBeCalled()
            expect(user).toEqual({
                userId: 1,
                username: 'crazy-bird',
                displayName: 'not a bird',
                createdDate: createdDate,
                updatedDate: createdDate,
            })


        })
    })
})