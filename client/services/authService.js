import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { API_BASE_URL, apiGet, apiJson } from './api';

export async function initiateGoogleLogin() {
  if (Platform.OS === 'web') {
    window.location.href = `${API_BASE_URL}/api/auth/google`;
    return { type: 'redirect' };
  } else {
    try {
      const result = await WebBrowser.openAuthSessionAsync(
        `${API_BASE_URL}/api/auth/google`,
        'wegotocalstatela://auth/callback'
      );
      return result;
    } catch (error) {
      console.error('OAuth error:', error);
      return { type: 'error', error };
    }
  }
}

// identifier can be a username or an email — the server figures out which.
export async function loginWithIdentifier(identifier, password) {
  return apiJson('/api/auth/login', 'POST', { identifier, password });
}

export async function signupWithIdentifier(identifier, password) {
  return apiJson('/api/auth/signup', 'POST', { identifier, password });
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