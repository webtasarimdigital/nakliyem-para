'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '@/lib/firebase/config';
import { db as mockDb } from '@/lib/data/mock-db';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isFirebaseActive: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isFirebaseActive: false,
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isFirebaseActive = isFirebaseConfigured();

  useEffect(() => {
    if (!isFirebaseActive || !auth || !db) {
      // Fallback to local mock user if Firebase is not configured
      const mockUser = mockDb.getCurrentUser();
      setUser(mockUser);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
          let profile: User;
          if (userDoc.exists()) {
            profile = userDoc.data() as User;
            if (!profile.id) profile.id = fbUser.uid;
          } else {
            profile = {
              id: fbUser.uid,
              email: fbUser.email || '',
              phone: '',
              role: 'CUSTOMER',
              fullName: fbUser.displayName || (fbUser.email ? fbUser.email.split('@')[0] : 'Kullanıcı'),
              createdAt: new Date().toISOString(),
            };
          }
          setUser(profile);
          mockDb.setCurrentUser(profile);
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('auth-changed'));
            window.dispatchEvent(new Event('storage'));
          }
        } catch (e) {
          console.error('Error fetching user profile from Firestore:', e);
          const fallbackProfile: User = {
            id: fbUser.uid,
            email: fbUser.email || '',
            phone: '',
            role: 'CUSTOMER',
            fullName: fbUser.displayName || (fbUser.email ? fbUser.email.split('@')[0] : 'Kullanıcı'),
            createdAt: new Date().toISOString(),
          };
          setUser(fallbackProfile);
          mockDb.setCurrentUser(fallbackProfile);
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('auth-changed'));
            window.dispatchEvent(new Event('storage'));
          }
        }
      } else {
        setUser(null);
        mockDb.setCurrentUser(null);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('auth-changed'));
          window.dispatchEvent(new Event('storage'));
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isFirebaseActive]);

  const logout = async () => {
    if (isFirebaseActive) {
      try {
        await auth.signOut();
      } catch (err) {
        console.warn('Sign out error:', err);
      }
    }
    mockDb.setCurrentUser(null);
    setUser(null);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('auth-changed'));
      window.dispatchEvent(new Event('storage'));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isFirebaseActive, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
