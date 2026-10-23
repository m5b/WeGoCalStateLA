import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const APP_NAME = 'wego-google-sign-in';
const config = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Initialize only when a future sign-in action requests Firebase.
// Existing login remains usable without Firebase configuration.
export function getFirebaseAuth() {
  if (Object.values(config).some((value) => !value?.trim())) {
    throw new Error('Firebase is not configured. Set the EXPO_PUBLIC_FIREBASE_* values in client/.env.local.');
  }
  const app = getApps().find((existing) => existing.name === APP_NAME)
    || initializeApp(config, APP_NAME);
  return getAuth(app);
}
