import * as z from 'zod'
export const userIDSchema = z.coerce.number({
    error: 'Input userId is not a number',
})

export const usernameSchema = z
    .string()
    .max(21, { message: 'String must be at most 21 characters long' })

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
