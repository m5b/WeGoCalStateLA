import fs from 'node:fs/promises'
import path from 'node:path'

// Folder uploaded files are written to (a Docker volume in production so
// they survive restarts; see composePrototype.yml).
export const UPLOAD_ROOT = process.env.UPLOAD_DIR
    ? path.resolve(process.env.UPLOAD_DIR)
    : path.resolve('uploads')

// Writes a file and returns its public URL. The URL is relative and under
// /api/uploads/ so nginx's existing /api/ proxy rule serves it with no new
// config needed, both locally and on the deployed site.
export async function uploadBuffer({ buffer, key }) {
    const destPath = path.join(UPLOAD_ROOT, key)
    await fs.mkdir(path.dirname(destPath), { recursive: true })
    await fs.writeFile(destPath, buffer)
    return `/api/uploads/${key}`
}


// Pictures in private messages must not be reachable through the public /api/uploads route, so they are
// written under this folder, which app.mjs refuses to serve. The messages API hands them out only to
// the two people in the conversation.
export const PRIVATE_DIR = '_private'

// Writes a private file and returns its path relative to the uploads folder (not a URL).
export async function uploadPrivateBuffer({ buffer, key }) {
    const relative = `${PRIVATE_DIR}/${key}`
    const destPath = path.join(UPLOAD_ROOT, relative)
    await fs.mkdir(path.dirname(destPath), { recursive: true })
    await fs.writeFile(destPath, buffer)
    return relative
}

// The file for a stored private path, or null if it points outside the private folder.
export function privateFilePath(relative) {
    const privateRoot = path.join(UPLOAD_ROOT, PRIVATE_DIR)
    const resolved = path.resolve(UPLOAD_ROOT, relative)
    return resolved.startsWith(privateRoot + path.sep) ? resolved : null
}