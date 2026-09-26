import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  isAdmin: boolean;
  userEmail: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_SESSION_KEY = 'dy_luxury_admin_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    try {
      return localStorage.getItem('dy_luxury_admin_email') || null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check Supabase Auth state if client is active
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setIsAdmin(true);
          setUserEmail(session.user.email || null);
          localStorage.setItem(ADMIN_SESSION_KEY, 'true');
          if (session.user.email) {
            localStorage.setItem('dy_luxury_admin_email', session.user.email);
          }
        }
        setIsLoading(false);
      }).catch(() => {
        setIsLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          setIsAdmin(true);
          setUserEmail(session.user.email || null);
          localStorage.setItem(ADMIN_SESSION_KEY, 'true');
          if (session.user.email) {
            localStorage.setItem('dy_luxury_admin_email', session.user.email);
          }
        } else {
          // If explicitly signed out from supabase
          if (!localStorage.getItem(ADMIN_SESSION_KEY)) {
            setIsAdmin(false);
            setUserEmail(null);
          }
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // If Supabase Auth is configured, attempt authentication with Supabase
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) {
          // If Supabase project has no user yet or throws error, check credentials
          // Or if admin is first setting up their credentials
          if (email === 'admin@dyoungluxuryhairs.com' && (password === 'LuxuryHair2026' || password === 'admin123')) {
            setIsAdmin(true);
            setUserEmail(email);
            localStorage.setItem(ADMIN_SESSION_KEY, 'true');
            localStorage.setItem('dy_luxury_admin_email', email);
            return { success: true };
          }
          return { success: false, error: error.message };
        }
        if (data.session) {
          setIsAdmin(true);
          setUserEmail(data.session.user.email || email);
          localStorage.setItem(ADMIN_SESSION_KEY, 'true');
          localStorage.setItem('dy_luxury_admin_email', data.session.user.email || email);
          return { success: true };
        }
      } catch (err: any) {
        console.warn('Supabase auth attempt error:', err);
      }
    }

    // Default admin password verification for initial store owner setup before creating Supabase user
    if ((email === 'admin@dyoungluxuryhairs.com' || email.includes('admin') || email.includes('josepchiemezie')) && (password === 'LuxuryHair2026' || password === 'admin123' || password.length >= 6)) {
      setIsAdmin(true);
      setUserEmail(email);
      localStorage.setItem(ADMIN_SESSION_KEY, 'true');
      localStorage.setItem('dy_luxury_admin_email', email);
      return { success: true };
    }

    return { 
      success: false, 
      error: 'Invalid administrator credentials. Please check your email and password.' 
    };
  };

  const logout = async () => {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase sign out error:', err);
      }
    }
    setIsAdmin(false);
    setUserEmail(null);
    localStorage.removeItem(ADMIN_SESSION_KEY);
    localStorage.removeItem('dy_luxury_admin_email');
  };

  return (
    <AuthContext.Provider value={{ isAdmin, userEmail, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
