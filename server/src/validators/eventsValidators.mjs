import * as z from 'zod'

// Validates the event-creation form fields. Arrives as multipart/form-data
// (because of the optional image), so every field is a plain string.
export const eventPostSchema = z.object({
    title: z.string().min(1, { message: 'Title is required' }).max(255),
    description: z.string().max(5000).optional().default(''),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'date must be YYYY-MM-DD' }),
    time: z.string().min(1, { message: 'Time is required' }).max(20),
    location: z.string().min(1, { message: 'Location is required' }).max(500),
}).strict()