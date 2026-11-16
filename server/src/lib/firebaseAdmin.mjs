import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

const APP_NAME = 'wego-google-sign-in'

// Lazy initialization keeps the existing backend usable without Firebase.
export function getFirebaseAdminAuth() {
    const projectId = process.env.FIREBASE_PROJECT_ID?.trim()
    if (!projectId) {
        throw new Error('Set FIREBASE_PROJECT_ID before using Firebase authentication.')
    }
    const app = getApps().find((existing) => existing.name === APP_NAME)
        || initializeApp({ projectId, credential: getCredential(projectId) }, APP_NAME)
    return getAuth(app)
}

function getCredential(projectId) {
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim()
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.trim()
    if (clientEmail || privateKey) {
        if (!clientEmail || !privateKey) {
            throw new Error('Set both FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY.')
        }
        return cert({ projectId, clientEmail, privateKey: privateKey.replace(/\\n/g, '\n') })
    }
    return applicationDefault()
}
