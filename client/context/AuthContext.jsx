import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { checkAuth, logout as logoutSession } from '../services/authService';

const AuthContext = createContext(null);
const GUEST_USER = { username: 'Community guest', preview: true };

export function AuthProvider({ children }) {
  const [user, setUser] = useState(GUEST_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const login = useCallback((userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    await logoutSession();
    setUser(GUEST_USER);
    setIsAuthenticated(false);
  }, []);

  const checkSession = useCallback(async () => {
    setIsLoading(true);
    const currentUser = await checkAuth();

    if (currentUser?.userId) {
      login(currentUser);
    } else {
      setUser(GUEST_USER);
      setIsAuthenticated(false);
    }

    setIsLoading(false);
    return currentUser;
  }, [login]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
