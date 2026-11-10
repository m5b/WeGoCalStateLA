import { apiGet, apiJson } from './api';
import { getGoogleIdToken, clearFirebaseSession } from './firebase';
import { normalizeGoogleError } from './googleAuthErrors';

async function clearGoogleState() {
  try {
    await clearFirebaseSession();
  } catch {
    // A cleanup failure must not replace a completed login or popup cancellation.
    console.warn('Could not clear Google sign-in state.');
  }
}

export async function initiateGoogleLogin({ link = false } = {}) {
  try {
    const idToken = await getGoogleIdToken();
    if (!idToken) return null;
    return await apiJson(link ? '/api/auth/google/link' : '/api/auth/google', 'POST', { idToken });
  } catch (error) {
    const friendlyError = normalizeGoogleError(error);
    if (!friendlyError) return null;
    throw friendlyError;
  } finally {
    // WeGo's HTTP-only cookie owns the session; Firebase supplies only the proof.
    await clearGoogleState();
  }
}

export async function getGoogleConnection() {
  const response = await apiGet('/api/auth/google');
  return response.data;
}

export async function disconnectGoogle(password) {
  const response = await apiJson('/api/auth/google', 'DELETE', { password });
  return response.data;
}

// identifier can be a username or an email — the server figures out which.
export async function loginWithIdentifier(identifier, password) {
  return apiJson('/api/auth/login', 'POST', { identifier, password });
}

export async function signupWithIdentifier(identifier, password) {
  return apiJson('/api/auth/signup', 'POST', { identifier, password });
}

export async function signOut() {
  const response = await apiJson('/api/auth/logout', 'POST', {});
  await clearGoogleState();
  return response;
}

export async function checkAuth() {
  try {
    const response = await apiGet('/api/user/me');
    return response.data.user;
  } catch (error) {
    console.log('Session check failed:', error);
    return null;
  }
}

export async function requestPasswordReset(email) {
  return apiJson('/api/auth/password-reset/request', 'POST', { email });
}

export async function verifyPasswordResetOtp(otp) {
  return apiJson('/api/auth/password-reset/verify', 'POST', { otp });
}

export async function completePasswordReset(password) {
  return apiJson('/api/auth/password-reset/complete', 'POST', { password });
}
