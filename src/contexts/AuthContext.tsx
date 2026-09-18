import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { User, CustomerProfile, Role } from '../types';
import { api } from '../api/client';

interface AuthState {
  user: User | null;
  customerProfile: CustomerProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User, customerProfile?: CustomerProfile) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const result = await api.getMe();
      if (result.user) {
        setUser(result.user);
        if (result.user.customerProfile) {
          setCustomerProfile(result.user.customerProfile);
        }
      } else {
        // Token invalid or expired
        api.setToken(null);
        setUser(null);
        setCustomerProfile(null);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      api.setToken(null);
      setUser(null);
      setCustomerProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Check if user is already logged in
    const token = api.getToken();
    if (token) {
      refreshUser();
    } else {
      setIsLoading(false);
    }

    // Listen for unauthorized events
    const handleUnauthorized = () => {
      setUser(null);
      setCustomerProfile(null);
    };

    window.addEventListener('cafepass:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('cafepass:unauthorized', handleUnauthorized);
  }, [refreshUser]);

  const login = (token: string, userData: User, profile?: CustomerProfile) => {
    api.setToken(token);
    setUser(userData);
    if (profile) {
      setCustomerProfile(profile);
    }
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
    setCustomerProfile(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      customerProfile,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
