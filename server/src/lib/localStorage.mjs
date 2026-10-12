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