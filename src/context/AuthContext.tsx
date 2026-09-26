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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setIsAdmin(true);
        setUserEmail(session.user.email || null);
      }
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsAdmin(true);
        setUserEmail(session.user.email || null);
      } else {
        setIsAdmin(false);
        setUserEmail(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    if (!supabase) {
      return {
        success: false,
        error: 'Authentication is not configured. Please try again later.',
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      if (data.session?.user) {
        setIsAdmin(true);
        setUserEmail(data.session.user.email || email);
        return { success: true };
      }

      return {
        success: false,
        error: 'Login failed. Please try again.',
      };
    } catch {
      return {
        success: false,
        error: 'Unable to connect to the authentication service.',
      };
    }
  };

  const logout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }

    setIsAdmin(false);
    setUserEmail(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAdmin,
        userEmail,
        login,
        logout,
        isLoading,
      }}
    >
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
