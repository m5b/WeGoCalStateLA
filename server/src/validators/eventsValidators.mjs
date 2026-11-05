import * as z from 'zod'

// Multipart form fields are always strings, so the public/private toggle
// arrives as 'true'/'false'.
const isPublicField = z.enum(['true', 'false']).transform((value) => value === 'true')

// Validates the event-creation form fields. Arrives as multipart/form-data
// (because of the optional image), so every field is a plain string.
export const eventPostSchema = z.object({
    title: z.string().min(1, { message: 'Title is required' }).max(255),
    description: z.string().max(5000).optional().default(''),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'date must be YYYY-MM-DD' }),
    time: z.string().min(1, { message: 'Time is required' }).max(20),
    location: z.string().min(1, { message: 'Location is required' }).max(500),
    isPublic: isPublicField.optional().default(false),
}).strict()


// Same fields as creation, all optional (no defaults, so omitted fields stay
// untouched). Date and time must be sent together since they're combined
// into a single started_at timestamp.
export const eventPatchSchema = z.object({
    title: z.string().min(1, { message: 'Title is required' }).max(255).optional(),
    description: z.string().max(5000).optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'date must be YYYY-MM-DD' }).optional(),
    time: z.string().min(1, { message: 'Time is required' }).max(20).optional(),
    location: z.string().max(500).optional(),
    isPublic: isPublicField.optional(),
}).strict()
    .refine((data) => (data.date === undefined) === (data.time === undefined), {
        message: 'date and time must be sent together',
    })
