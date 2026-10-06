import * as z from 'zod'
export const userIdSchema = z.object({
    userId: z.coerce
        .number({
            message: 'Not a number',
        })
        .int({ message: 'Not a integer' }),
})

export const usernameSchema = z.object({
    username: z
        .string()
        .min(5, { messsage: 'String must be at least 5 character long' })
        .max(21, { message: 'String must be at most 21 characters long' }),
})

export const userSchema = z
    .object({
        //can be add more field later when there is more changeable data
        displayName: z
            .string()
            .min(5, { message: 'String must be at least 5 characters long' })
            .max(21, { message: 'String must be at most 21 characters long' }),
    })
    .partial()
    .refine(({ displayName }) => displayName !== undefined, {
        message: 'One of the fields must be defined',
    })

//change the password and email require more process, so defining a individual schema might be better

// Admin-only: unlike profileSchema (self-serve), this allows changing
// isAdmin. Never exposed through the self-serve PATCH /user/me route.
export const adminUserPatchSchema = z
    .object({
        alias: z.string().min(1).max(40),
        relationship: z.string().max(80),
        interests: z.string().max(240),
        isAdmin: z.boolean(),
    })
    .partial()
    .refine(
        (v) => Object.keys(v).length > 0,
        { message: 'One of the fields must be defined' }
    )