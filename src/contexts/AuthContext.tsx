'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthContextType } from '@/types';
import { mockApi } from '@/lib/mockApi';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStoredAuth = async () => {
      const { user: storedUser, token: storedToken } = await mockApi.getStoredAuth();
      setUser(storedUser);
      setToken(storedToken);
      setIsLoading(false);
    };
    loadStoredAuth();
  }, []);

  const login = async (email: string, password: string, role: 'employee' | 'manager') => {
    console.log('AuthContext login called with:', { email, role });
    setIsLoading(true);
    try {
      console.log('Calling mockApi.login...');
      const { user, token } = await mockApi.login(email, password, role);
      console.log('mockApi.login successful, setting user and token...');
      setUser(user);
      setToken(token);
      console.log('AuthContext login completed successfully');
    } catch (error) {
      console.error('AuthContext login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: 'employee' | 'manager') => {
    setIsLoading(true);
    try {
      const { user, token } = await mockApi.register(name, email, password, role);
      setUser(user);
      setToken(token);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await mockApi.logout();
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    if (!token) return false;

    try {
      const newToken = await mockApi.refreshToken(token);
      if (newToken) {
        setToken(newToken);
        if (typeof window !== 'undefined') {
          localStorage.setItem('vrs_auth_token', newToken);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    refreshToken,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};