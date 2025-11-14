import * as z from 'zod'

export const threadIdSchema = z.coerce.number({
    message: 'Input threadId is not a number',
})

export const createThreadSchema = z.object({
    userId: z.coerce.number(),
    title: z.string().min(1),
    body: z.string().min(1),
})
