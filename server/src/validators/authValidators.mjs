import * as z from 'zod'
export const emailPasswordSchema = z
    .object({
        email: z.email({ message: 'Not a email' }),
        password: z
            .string()
            .min(8, { message: 'password must be at least 5 characters long' })
            .max(21, { message: 'password must be at most 21 characters long' })
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                {
                    message:
                        'password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
                }
            ),
    })
    .strict({ message: 'The payload can only contain email and password' })

export const emailSchema = z.object({
    email: z.email({ message: 'Not a email' }),
}).strict()

export const passwordSchema= z.object({
    password: z
        .string()
        .min(8, { message: 'password must be at least 5 characters long' })
        .max(21, { message: 'password must be at most 21 characters long' })
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            {
                message:
                    'password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
            }
        ),
}).strict()

export const emailHashSchema = z.object({
    emailHash: z.string()
}).strict()

export const verifyOTPSchema = z.object({
    otp: z.string().regex(/^\d{6}$/, {
    message: "Must be a string of exactly 6 digits"
})}).strict()




