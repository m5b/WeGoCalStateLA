const cancellations = new Set([
  'auth/popup-closed-by-user', 'auth/cancelled-popup-request',
  'auth/user-cancelled', 'auth/redirect-cancelled-by-user', 'access_denied',
]);

const messages = {
  'auth/popup-blocked': 'Allow pop-ups for this website, then try Google sign-in again.',
  'auth/unauthorized-domain': 'Google sign-in is not enabled for this website address.',
  'auth/operation-not-allowed': 'Google sign-in is not available right now. Please try again later.',
  'auth/configuration-not-found': 'Google sign-in is not available right now. Please try again later.',
  'auth/invalid-api-key': 'Google sign-in is not available right now. Please try again later.',
  'auth/network-request-failed': 'Could not reach Google. Check your connection and try again.',
  'auth/too-many-requests': 'Too many sign-in attempts. Please wait a moment and try again.',
  'auth/operation-not-supported-in-this-environment': 'Use the web app to sign in with Google.',
  'auth/account-exists-with-different-credential': 'Sign in using your existing method, then connect Google from Your profile.',
};

export function normalizeGoogleError(error) {
  const code = error?.code || error?.message?.match(/\b(auth\/[a-z-]+)\b/)?.[1];
  if (cancellations.has(code)) return null;
  if (messages[code]) return new Error(messages[code]);
  // Preserve actionable API errors, including the existing-account linking response.
  if ([400, 401, 403, 404, 409, 429, 503].includes(error?.status) && error.message &&
      !/firebase|auth\/|EXPO_PUBLIC_/i.test(error.message)) return error;
  if (error instanceof TypeError && /fetch|network/i.test(error.message)) {
    return new Error('Could not reach WeGo. Check your connection and try again.');
  }
  return new Error('Google sign-in did not finish. Please try again.');
}
