import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, Customer, Cafe } from '../types';
import { PILOT_CUSTOMERS, PILOT_CAFES } from '../data/store';

interface AuthState {
  user: User | null;
  customer: Customer | null;
  cafe: Cafe | null;
  isAuthenticated: boolean;
  login: (phone: string, name: string, role: 'customer' | 'cafe_owner') => void;
  logout: () => void;
  switchToCafe: (cafeId: string) => void;
  switchToCustomer: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [cafe, setCafe] = useState<Cafe | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('cafepass_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      setUser(parsed.user);
      setCustomer(parsed.customer);
      setCafe(parsed.cafe);
    }
  }, []);

  const login = (phone: string, name: string, role: 'customer' | 'cafe_owner') => {
    const newUser: User = {
      id: 'user-' + Date.now(),
      phone,
      name,
      role,
      createdAt: new Date().toISOString()
    };
    
    let cust: Customer | null = null;
    let caf: Cafe | null = null;

    if (role === 'customer') {
      // Check if customer exists in pilot data
      const existing = PILOT_CUSTOMERS.find(c => c.phone === phone);
      if (existing) {
        cust = existing;
      } else {
        cust = {
          id: 'cust-' + Date.now(),
          userId: newUser.id,
          name,
          phone,
          totalPoints: 0,
          totalVisits: 0,
          totalSpent: 0,
          favoriteCafes: [],
          joinedAt: new Date().toISOString(),
          level: 'bronze'
        };
      }
    } else {
      // For cafe owner, assign first cafe
      caf = PILOT_CAFES.find(c => c.ownerId === 'owner-1') || PILOT_CAFES[0];
    }

    setUser(newUser);
    setCustomer(cust);
    setCafe(caf);
    localStorage.setItem('cafepass_user', JSON.stringify({ user: newUser, customer: cust, cafe: caf }));
  };

  const logout = () => {
    setUser(null);
    setCustomer(null);
    setCafe(null);
    localStorage.removeItem('cafepass_user');
  };

  const switchToCafe = (cafeId: string) => {
    const found = PILOT_CAFES.find(c => c.id === cafeId);
    if (found) {
      setCafe(found);
      localStorage.setItem('cafepass_user', JSON.stringify({ user, customer, cafe: found }));
    }
  };

  const switchToCustomer = () => {
    const cust = PILOT_CUSTOMERS.find(c => c.userId === user?.id) || PILOT_CUSTOMERS[0];
    setCustomer(cust);
    setCafe(null);
    localStorage.setItem('cafepass_user', JSON.stringify({ user, customer: cust, cafe: null }));
  };

  return (
    <AuthContext.Provider value={{
      user,
      customer,
      cafe,
      isAuthenticated: !!user,
      login,
      logout,
      switchToCafe,
      switchToCustomer
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
