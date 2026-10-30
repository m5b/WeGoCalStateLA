import * as z from 'zod'

export const threadIdSchema = z.object({
    threadId: z.coerce
        .number({
            message: 'Not a number',
        })
        .int({ message: 'Not a integer' }),
})

// Shared fields with no defaults, so the patch schema below only contains
// what the request actually sent (a default would overwrite the stored value).
const threadFields = z.object({
    title: z.string({message: "Not a String"}).min(20, {message: "The title must at least contain 20 characters"}).max(200, {message: "The title  can not contain more than characters"}),
    content: z.string({message: "Not a String"}).min(1).max(20000),
    category: z.enum(['general', 'events', 'faq']),
    // New threads arrive as multipart form data (for the optional photo), where
    // the toggle is the string 'true'/'false'; edits arrive as JSON booleans.
    isPublic: z.union([
        z.boolean(),
        z.enum(['true', 'false']).transform((value) => value === 'true'),
    ]),
})

export const threadPostSchema = threadFields
    .extend({
        category: threadFields.shape.category.optional().default('general'),
        isPublic: threadFields.shape.isPublic.optional().default(false),
    })
    .strict()

export const threadPatchSchema = threadFields
    .partial()
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
        message: 'One of the fields must be defined',
    })
