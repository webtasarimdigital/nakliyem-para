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
    if (!isFirebaseActive) {
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
          if (userDoc.exists()) {
            setUser(userDoc.data() as User);
          } else {
            setUser({
              id: fbUser.uid,
              email: fbUser.email || '',
              phone: '',
              role: 'CUSTOMER',
              createdAt: new Date().toISOString(),
            });
          }
        } catch (e) {
          console.error('Error fetching user profile from Firestore:', e);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isFirebaseActive]);

  const logout = async () => {
    if (isFirebaseActive) {
      await auth.signOut();
    } else {
      mockDb.setCurrentUser(null);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isFirebaseActive, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
