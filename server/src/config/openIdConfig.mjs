import { URL } from 'node:url'

export const openIdConfig ={
    google: {
        issuer: new URL('https://accounts.google.com'),
        clientId : process.env.GOOGLE_CLIENT_ID,
        clientSecret : process.env.GOOGLE_CLIENT_SECRET,
        redirectUri: process.env.SERVER_URL_DEV + process.env.GOOGLE_CALLBACK_URL
    },
}



