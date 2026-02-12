const isProduction = process.env.NODE_ENV === 'production'

export const cookieConfig = {
    httpOnly: true,
    secure: isProduction,
    maxAge: 60000 * 60,
    sameSite: 'lax',
}
