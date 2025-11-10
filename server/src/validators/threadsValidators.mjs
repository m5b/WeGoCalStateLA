import * as z from 'zod'

export const threadIDSchema = z.coerce.number({
    error: 'Input threadId is not a number',
})