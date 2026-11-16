import * as z from 'zod'
import { MAX_MESSAGE_LENGTH } from '../lib/messageLimits.mjs'

export { MAX_MESSAGE_LENGTH }

// The text may be empty when a picture is attached; the service checks there is at least one of the two.
export const messageSendSchema = z.object({
    content: z.string({message: 'Not a String'}).max(MAX_MESSAGE_LENGTH).default(''),
}).strict()

export const messageReportSchema = z.object({
    reason: z.string({message: 'Not a String'}).trim()
        .min(3, {message: 'Please say what is wrong.'})
        .max(500, {message: 'Please keep it under 500 characters.'}),
}).strict()

export const peopleSearchSchema = z.object({
    q: z.string({message: 'Not a String'}).trim().min(2).max(50),
})