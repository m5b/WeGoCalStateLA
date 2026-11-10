import { Platform } from 'react-native';
import { getApps, initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, inMemoryPersistence, setPersistence, signInWithPopup, signOut } from 'firebase/auth';

const APP_NAME = 'wego-google-sign-in';
const config = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Password-only sessions do not require Firebase configuration.
export function getFirebaseAuth() {
  if (Object.values(config).some((value) => !value?.trim())) {
    throw Object.assign(new Error('Google sign-in is not configured.'), { code: 'auth/configuration-not-found' });
  }
  const app = getApps().find((existing) => existing.name === APP_NAME)
    || initializeApp(config, APP_NAME);
  return getAuth(app);
}

export async function clearFirebaseSession() {
  const app = getApps().find((existing) => existing.name === APP_NAME);
  if (app) await signOut(getAuth(app));
}

export async function getGoogleIdToken() {
  if (Platform.OS !== 'web') throw Object.assign(new Error('Google sign-in requires a browser.'), { code: 'auth/operation-not-supported-in-this-environment' });
  const auth = getFirebaseAuth();
  await setPersistence(auth, inMemoryPersistence);
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const result = await signInWithPopup(auth, provider);
  return result.user.getIdToken();
}
