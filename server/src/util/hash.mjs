import crypto from 'crypto'

export function sha256Hex(input){
    return crypto.createHash('sha256').update(input).digest(`hex`)
}

export function hkdf(input){
    return crypto.hkdfSync("sha256", input, "wego-v1", "wego-auth", 32)
}