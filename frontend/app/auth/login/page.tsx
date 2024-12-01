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

    console.log('Login attempt:', { email }); // Přidáno pro ladění

    try {
      // Přidáme kontrolu připojení k Supabase
      console.log('Supabase client configuration:', {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        anonKeyPresent: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      });

      // Zkontrolujeme dostupnost schématu
      try {
        const schemaCheck = await supabase.rpc('current_schema');
        console.log('Current schema:', schemaCheck);
      } catch (schemaError) {
        console.error('Schema check error:', schemaError);
      }

      // Přidáme kontrolu připojení k Supabase
      const supabaseStatus = await supabase.from('users').select('*').limit(1);
      console.log('Supabase connection status:', supabaseStatus);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('SignIn response:', { data, error }); // Přidáno pro ladění

      if (error) {
        console.error('Login error details:', {
          message: error.message,
          status: error.status,
          code: error.code,
          details: error.details
        });
        throw error;
      }

      if (data?.user) {
        console.log('User authenticated:', data.user);

        // Přidáme kontrolu existence uživatele v databázi
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', data.user.id)
          .single();

        console.log('User database check:', { userData, userError }); // Přidáno pro ladění

        if (userError) {
          console.error('User role fetch error:', {
            message: userError.message,
            details: userError.details
          });
          
          // Pokud uživatel není v databázi, zkusíme ho vytvořit
          if (userError.code === 'PGRST116') {
            console.log('User not found in database, attempting to create...');
            const { data: newUserData, error: createError } = await supabase
              .from('users')
              .insert({
                id: data.user.id,
                first_name: 'Uživatel',
                last_name: 'Systém',
                email: data.user.email,
                role: 'user'
              });

            if (createError) {
              console.error('User creation error:', createError);
              throw createError;
            }

            console.log('User created successfully:', newUserData);
          } else {
            throw userError;
          }
        }

        // Aktualizovat metadata uživatele s rolí
        const { data: updateData, error: updateError } = await supabase.auth.updateUser({
          data: { role: userData?.role || 'user' }
        });

        console.log('User metadata update:', { updateData, updateError }); // Přidáno pro ladění

        if (updateError) {
          console.error('User metadata update error:', {
            message: updateError.message,
            details: updateError.details
          });
          throw updateError;
        }

        // Přesměrování na původní stránku nebo dashboard
        const redirectTo = searchParams.get('redirectTo') || '/dashboard';
        router.push(redirectTo);
        router.refresh();
      }
    } catch (error) {
      console.error('Comprehensive login error:', error);
      toast({
        title: 'Chyba přihlášení',
        description: error instanceof Error ? error.message : 'Nastala neočekávaná chyba',
        variant: 'destructive'
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
