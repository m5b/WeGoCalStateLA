export const corsConfig = {
    origin: process.env.CLIENT_URL_DEV,
    credentials: true,
    methods: ['GET', 'PATCH', 'DELETE', 'POST', 'PUT', 'OPTIONS'],
}
