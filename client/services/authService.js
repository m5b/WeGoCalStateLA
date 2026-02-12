import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { apiGet } from './api';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export async function initiateGoogleLogin() {
  if (Platform.OS === 'web') {
    window.location.href = `${BASE_URL}/api/auth/google`;
    return { type: 'redirect' };
  } else {
    try {
      const result = await WebBrowser.openAuthSessionAsync(
        `${BASE_URL}/api/auth/google`,
        'wegoapp://auth/callback'
      );
      return result;
    } catch (error) {
      console.error('OAuth error:', error);
      return { type: 'error', error };
    }
  }
}

export async function checkAuth() {
  try {
    const userData = await apiGet('/api/auth/me');
    return userData;
  } catch (error) {
    console.log('Session check failed:', error);
    return null;
  }
}
