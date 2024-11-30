import { useToast } from '@/hooks/use-toast';
import { authHelpers } from '@/lib/supabase/authHelpers';
import { supabase } from '@/lib/supabase/client';
import { AuthContextType, AuthSession, UserProfile } from '@/types/auth';
import { useRouter } from 'next/router';
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PUBLIC_ROUTES = ['/login', '/register', '/reset-password', '/'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Načtení počátečního stavu session
    const initializeAuth = async () => {
      try {
        const {
          data: { session: initialSession },
        } = await supabase.auth.getSession();

        setSession(
          initialSession
            ? {
                user: initialSession.user,
                accessToken: initialSession.access_token,
              }
            : null
        );

        // Nastavení posluchače pro změny v autentizaci
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
          setSession(
            currentSession
              ? {
                  user: currentSession.user,
                  accessToken: currentSession.access_token,
                }
              : null
          );

          if (event === 'SIGNED_IN') {
            toast({
              title: 'Přihlášení úspěšné',
              description: 'Vítejte zpět!',
            });
          } else if (event === 'SIGNED_OUT') {
            toast({
              title: 'Odhlášení úspěšné',
              description: 'Nashledanou!',
            });
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing auth:', error);
        setError(
          error instanceof Error
            ? error
            : new Error('Failed to initialize auth')
        );
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [toast]);

  useEffect(() => {
    // Ochrana routů
    const handleRouteProtection = async () => {
      const currentPath = router.pathname;
      const isPublicRoute = PUBLIC_ROUTES.includes(currentPath);

      if (!session && !isPublicRoute && !loading) {
        // Uložení původní URL pro přesměrování po přihlášení
        router.push({
          pathname: '/login',
          query: { returnUrl: router.asPath },
        });
      } else if (session && currentPath === '/login') {
        // Přesměrování na dashboard po přihlášení
        router.push('/dashboard');
      }
    };

    handleRouteProtection();
  }, [session, router.pathname, loading, router]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      await authHelpers.signIn(email, password);
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Failed to sign in'));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      await authHelpers.signUp(email, password);
      toast({
        title: 'Registrace úspěšná',
        description: 'Prosím zkontrolujte svůj email pro potvrzení registrace.',
      });
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Failed to sign up'));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await authHelpers.signOut();
      router.push('/login');
    } catch (error) {
      setError(
        error instanceof Error ? error : new Error('Failed to sign out')
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      toast({
        title: 'Email odeslán',
        description: 'Pokyny k resetování hesla byly odeslány na váš email.',
      });
    } catch (error) {
      setError(
        error instanceof Error ? error : new Error('Failed to reset password')
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    session,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
