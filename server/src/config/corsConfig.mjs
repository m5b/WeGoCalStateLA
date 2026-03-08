export const corsConfig = {
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'PATCH', 'DELETE', 'POST', 'PUT', 'OPTIONS'],
}
