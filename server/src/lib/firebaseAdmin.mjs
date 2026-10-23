import { applicationDefault, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

const APP_NAME = 'wego-google-sign-in'

// Lazy initialization keeps the existing backend usable without Firebase.
export function getFirebaseAdminAuth() {
    const projectId = process.env.FIREBASE_PROJECT_ID?.trim()
    if (!projectId) {
        throw new Error('Set FIREBASE_PROJECT_ID before using Firebase authentication.')
    }
    const app = getApps().find((existing) => existing.name === APP_NAME)
        || initializeApp({ projectId, credential: applicationDefault() }, APP_NAME)
    return getAuth(app)
}
