import * as z from 'zod'

export const commentIDSchema = z.coerce.number({
    error: 'Input commentId is not a number',
})