import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { apiGet, apiJson } from './api';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
const USE_MOCK_AUTH =
  process.env.NODE_ENV === 'development' &&
  process.env.EXPO_PUBLIC_USE_MOCK_AUTH === 'true';

const MOCK_SESSION_KEY = 'wego-mock-auth-session-v1';
const MOCK_EMAIL = 'demo@wego.local';
const MOCK_PASSWORD = 'demo1234';
const MOCK_USER = {
  userId: 1,
  userUuid: '00000000-0000-4000-8000-000000000001',
  username: 'Demo user',
  email: MOCK_EMAIL,
};

let mockSessionUser = null;

function readMockSession() {
  if (mockSessionUser) return mockSessionUser;
  if (Platform.OS !== 'web') return null;

  try {
    const storedUser = globalThis.localStorage?.getItem(MOCK_SESSION_KEY);
    mockSessionUser = storedUser ? JSON.parse(storedUser) : null;
    return mockSessionUser;
  } catch {
    return null;
  }
}

function saveMockSession(user) {
  mockSessionUser = user;

  if (Platform.OS === 'web') {
    try {
      globalThis.localStorage?.setItem(MOCK_SESSION_KEY, JSON.stringify(user));
    } catch {
      // Mock login still works for this page when browser storage is unavailable.
    }
  }
}

function clearMockSession() {
  mockSessionUser = null;

  if (Platform.OS === 'web') {
    try {
      globalThis.localStorage?.removeItem(MOCK_SESSION_KEY);
    } catch {
      // There is no persisted mock session to clear when storage is unavailable.
    }
  }
}

export async function initiateGoogleLogin() {
  if (Platform.OS === 'web') {
    window.location.href = `${BASE_URL}/api/auth/google`;
    return { type: 'redirect' };
  } else {
    try {
      const result = await WebBrowser.openAuthSessionAsync(
        `${BASE_URL}/api/auth/google`,
        'wegotocalstatela://auth/callback'
      );
      return result;
    } catch (error) {
      console.error('OAuth error:', error);
      return { type: 'error', error };
    }
  }
}

export async function loginWithEmail(email, password) {
  if (USE_MOCK_AUTH) {
    if (email !== MOCK_EMAIL || password !== MOCK_PASSWORD) {
      const error = new Error('Invalid email or password.');
      error.status = 401;
      throw error;
    }

    const user = { ...MOCK_USER };
    saveMockSession(user);
    return user;
  }

  return apiJson('/api/auth/login', 'POST', { email, password });
}

export async function signupWithEmail(email, password) {
  return apiJson('/api/auth/signup', 'POST', { email, password });
}

export async function checkAuth() {
  if (USE_MOCK_AUTH) return readMockSession();

  try {
    const response = await apiGet('/api/user/me');
    return response.data.user;
  } catch (error) {
    console.log('Session check failed:', error);
    return null;
  }
}

export async function logout() {
  if (USE_MOCK_AUTH) clearMockSession();
}
