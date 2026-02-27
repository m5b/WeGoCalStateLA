export const cookieConfig = {
    httpOnly: true,
    maxAge: 60000 * 60,
    sameSite: 'lax',
}


export const oidcCookieConfig = {
    httpOnly: true,
    secure: true,
    maxAge: 5 * 60000,
    path: "/",
    sameSite: 'lax',
}

export const otpTokenCookieConfig = {
    httpOnly: true,
    secure: true,
    maxAge: 5 * 60000,
    path: '/',
    sameSite: 'lax',
}

export const signupTokenCookieConfig= {
    httpOnly: true,
    secure: true,
    maxAge: 5 * 60000,
    path: '/',
    sameSite: 'lax',
}


export const loginTokenCookieConfig= {
    httpOnly: true,
    secure: true,
    maxAge: 5 * 60000,
    path: '/',
    sameSite: 'lax',
}

