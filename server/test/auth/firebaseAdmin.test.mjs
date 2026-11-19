import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirebaseAdminAuth } from '../../src/lib/firebaseAdmin.mjs'

vi.mock('firebase-admin/app', () => ({
    applicationDefault: vi.fn(), cert: vi.fn(), getApps: vi.fn(), initializeApp: vi.fn(),
}))
vi.mock('firebase-admin/auth', () => ({ getAuth: vi.fn() }))

beforeEach(() => {
    vi.resetAllMocks()
    vi.stubEnv('FIREBASE_PROJECT_ID', 'test-project')
    vi.stubEnv('FIREBASE_CLIENT_EMAIL', '')
    vi.stubEnv('FIREBASE_PRIVATE_KEY', '')
    getApps.mockReturnValue([])
    initializeApp.mockReturnValue({ name: 'wego-google-sign-in' })
    getAuth.mockReturnValue({ verifyIdToken: vi.fn() })
})
afterEach(() => vi.unstubAllEnvs())

describe('Firebase Admin credentials', () => {
    it('preserves Application Default Credentials when inline credentials are absent', () => {
        vi.stubEnv('GOOGLE_APPLICATION_CREDENTIALS', '/run/secrets/firebase-admin.json')
        applicationDefault.mockReturnValue('file-or-runtime-credential')
        expect(getFirebaseAdminAuth()).toBe(getAuth.mock.results[0].value)
        expect(applicationDefault).toHaveBeenCalledOnce()
        expect(cert).not.toHaveBeenCalled()
        expect(initializeApp).toHaveBeenCalledWith({
            projectId: 'test-project', credential: 'file-or-runtime-credential',
        }, 'wego-google-sign-in')
    })

    it.each(['first-line\\nsecond-line', 'first-line\nsecond-line'])(
        'accepts escaped or actual newlines in the environment private key', (privateKey) => {
            vi.stubEnv('FIREBASE_CLIENT_EMAIL', ' service-account@example.test ')
            vi.stubEnv('FIREBASE_PRIVATE_KEY', privateKey)
            cert.mockReturnValue('inline-credential')
            getFirebaseAdminAuth()
            expect(cert).toHaveBeenCalledWith({
                projectId: 'test-project', clientEmail: 'service-account@example.test',
                privateKey: 'first-line\nsecond-line',
            })
            expect(applicationDefault).not.toHaveBeenCalled()
            expect(initializeApp).toHaveBeenCalledWith({
                projectId: 'test-project', credential: 'inline-credential',
            }, 'wego-google-sign-in')
        },
    )

    it.each(['FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY'])(
        'rejects incomplete environment credentials when only %s is set', (field) => {
            vi.stubEnv(field, 'partial-credential')
            expect(() => getFirebaseAdminAuth()).toThrow('Set both FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY.')
            expect(applicationDefault).not.toHaveBeenCalled()
            expect(initializeApp).not.toHaveBeenCalled()
        },
    )

    it('requires an explicit project ID', () => {
        vi.stubEnv('FIREBASE_PROJECT_ID', ' ')
        expect(() => getFirebaseAdminAuth()).toThrow('Set FIREBASE_PROJECT_ID')
        expect(initializeApp).not.toHaveBeenCalled()
    })

    it('reuses the initialized app without reading credentials again', () => {
        const existing = { name: 'wego-google-sign-in' }
        getApps.mockReturnValue([existing])
        getFirebaseAdminAuth()
        expect(getAuth).toHaveBeenCalledWith(existing)
        expect(applicationDefault).not.toHaveBeenCalled()
        expect(cert).not.toHaveBeenCalled()
        expect(initializeApp).not.toHaveBeenCalled()
    })
})
