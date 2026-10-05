import React, { createContext, useContext, useEffect, useState } from 'react';
import { checkAuth } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState({ username: 'Community guest', preview: true });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    setUser({ username: 'Community guest', preview: true });
    setIsAuthenticated(false);
  };

  const checkSession = async () => {
    const userData = await checkAuth();
    if (userData && userData.userUuid) {
      setUser(userData);
      setIsAuthenticated(true);
    }
    return userData;
  };

  useEffect(() => {
    checkSession().finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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