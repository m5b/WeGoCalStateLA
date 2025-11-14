import * as z from 'zod'

export const commentIdSchema = z.coerce.number({
    error: 'Input commentId is not a number',
})

export const createCommentSchema = z.object({
    title: z.string(),
    content: z.string(),
})
