import * as z from 'zod'

export const threadIdSchema = z.coerce.number({
    messgae: 'Input threadId is not a number',
})
