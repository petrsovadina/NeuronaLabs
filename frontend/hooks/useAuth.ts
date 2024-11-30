import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Inicializace sledování stavu autentizace
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Chyba při načítání uživatele:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Nastavení listeneru pro změny autentizace
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        
        // Automatické přesměrování podle stavu
        if (event === 'SIGNED_IN') {
          router.push('/dashboard');
        } else if (event === 'SIGNED_OUT') {
          router.push('/login');
        }
      }
    );

    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  // Metody pro autentizaci
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });

      if (error) throw error;
    } catch (error) {
      console.error('Chyba přihlášení:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string, 
    password: string, 
    metadata?: Record<string, any>
  ) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: { data: metadata }
      });

      if (error) throw error;
    } catch (error) {
      console.error('Chyba registrace:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Chyba odhlášení:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;
    } catch (error) {
      console.error('Chyba resetování hesla:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
    resetPassword
  };
}
