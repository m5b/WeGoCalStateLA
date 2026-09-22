import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState({ username: 'Community guest', preview: true });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading] = useState(false);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    setUser({ username: 'Community guest', preview: true });
    setIsAuthenticated(false);
  };

  const checkSession = async () => null;

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
