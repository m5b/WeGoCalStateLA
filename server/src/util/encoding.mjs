export function encoding(base64UrlString) {
    // Replace base64url chars with standard base64 chars and remove padding
    const standardBase64 = base64UrlString.replace(/-/g, '+').replace(/_/g, '/')
    // Note: Node.js Buffer handles optional padding automatically,
    // so explicit padding is not strictly necessary.

    // Create a Buffer from the standard base64 string
    const buffer = Buffer.from(standardBase64, 'base64')

    // A Node.js Buffer is a Uint8Array, so you can just return it.
    return new Uint8Array(buffer)
}

export function uint8ArrayToBase64UrlString(uint8Array) {
    // Convert the Uint8Array to a standard Base64 string using Node.js Buffer
    const base64String = Buffer.from(uint8Array).toString('base64')

    // Convert the standard Base64 string to a Base64URL string
    // by replacing '+' with '-', '/' with '_', and removing padding '='
    const base64UrlString = base64String
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+/g, '')

    return base64UrlString
}