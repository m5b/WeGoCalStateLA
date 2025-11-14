import * as z from 'zod'

export const threadIdSchema = z.coerce.number({
    message: 'Input threadId is not a number',
})
