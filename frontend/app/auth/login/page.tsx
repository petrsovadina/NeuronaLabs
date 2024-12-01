'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';
import { Database } from '@/types/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const supabase = createClientComponentClient<Database>();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data?.user) {
        // Získat roli uživatele
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (userError) throw userError;

        // Aktualizovat metadata uživatele s rolí
        await supabase.auth.updateUser({
          data: { role: userData?.role || 'user' }
        });

        // Přesměrování na původní stránku nebo dashboard
        const redirectTo = searchParams.get('redirectTo') || '/dashboard';
        router.push(redirectTo);
        router.refresh();
      }
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = 'Nepodařilo se přihlásit';
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Nesprávný email nebo heslo';
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'Email nebyl potvrzen. Zkontrolujte prosím svou emailovou schránku.';
      }

      toast({
        title: 'Chyba při přihlášení',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Přihlášení</h1>
          <p className="text-muted-foreground mt-2">
            Přihlaste se do systému NeuronaLabs
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="vas@email.cz"
                className="mt-1"
                disabled={loading}
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Heslo
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="mt-1"
                disabled={loading}
                autoComplete="current-password"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Přihlašování...' : 'Přihlásit se'}
            </Button>
          </div>

          <div className="text-center text-sm">
            <Link
              href="/auth/reset-password"
              className="text-primary hover:underline"
            >
              Zapomenuté heslo?
            </Link>
          </div>

          <div className="text-center text-sm">
            Nemáte účet?{' '}
            <Link href="/auth/register" className="text-primary hover:underline">
              Zaregistrujte se
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
