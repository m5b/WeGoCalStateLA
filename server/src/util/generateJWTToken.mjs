//generate jwt using provided payload
import jwt from 'jsonwebtoken'

export function signJWTToken(payload, duration) {
    return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
            expiresIn: duration,
            issuer: process.env.JWT_ISSUER,
        }
    )
}
export function generateAccessToken(userId){
    return signJWTToken({sub: userId}, "1h")
}

export function generateOIDCToken(key){
    return signJWTToken({sub: key}, "5m")
}



