'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClientComponentClient();

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return 'Heslo musí mít alespoň 8 znaků';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Heslo musí obsahovat alespoň jedno velké písmeno';
    }
    if (!/[0-9]/.test(password)) {
      return 'Heslo musí obsahovat alespoň jednu číslici';
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return 'Heslo musí obsahovat alespoň jeden speciální znak';
    }
    return null;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validace hesla před registrací
    const passwordError = validatePassword(password);
    if (passwordError) {
      toast({
        title: 'Neplatné heslo',
        description: passwordError,
        variant: 'destructive'
      });
      setLoading(false);
      return;
    }

    console.log('Registration attempt:', { 
      email, 
      firstName, 
      lastName,
      supabaseConfig: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        anonKeyPresent: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      }
    });

    try {
      // Kontrola připojení k Supabase
      const supabaseStatus = await supabase.from('users').select('*').limit(1);
      console.log('Supabase connection status:', supabaseStatus);

      // Kontrola existence uživatele před registrací
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', email)
        .single();

      if (existingUser) {
        toast({
          title: 'Registrace selhala',
          description: 'Uživatel s tímto emailem již existuje',
          variant: 'destructive'
        });
        return;
      }

      // Registrace uživatele
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
          emailRedirectTo: process.env.NEXT_PUBLIC_AUTH_CALLBACK_URL || '/dashboard'
        },
      });

      console.log('SignUp response:', { authData, authError });

      if (authError) {
        console.error('Auth registration error:', {
          message: authError.message,
          status: authError.status,
          code: authError.code,
          details: authError.details
        });

        let errorMessage = 'Nepodařilo se vytvořit účet';
        switch (authError.message) {
          case 'User already registered':
            errorMessage = 'Uživatel s tímto emailem je již zaregistrován';
            break;
          case 'Invalid email address':
            errorMessage = 'Neplatná emailová adresa';
            break;
          case 'Password too short':
            errorMessage = 'Heslo je příliš krátké';
            break;
        }

        toast({
          title: 'Chyba registrace',
          description: errorMessage,
          variant: 'destructive'
        });

        throw authError;
      }

      if (authData?.user) {
        console.log('User authenticated:', authData.user);

        // Vytvoření profilu uživatele v tabulce users
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .upsert({
            id: authData.user.id,
            email,
            first_name: firstName,
            last_name: lastName,
            role: 'doctor', // Výchozí role
          }, { 
            onConflict: 'id' 
          });

        console.log('User profile upsert:', { profileData, profileError });

        if (profileError) {
          console.error('Profile creation error:', {
            message: profileError.message,
            details: profileError.details
          });
          
          toast({
            title: 'Chyba vytvoření profilu',
            description: 'Nepodařilo se vytvořit uživatelský profil',
            variant: 'destructive'
          });

          throw profileError;
        }

        toast({
          title: 'Registrace úspěšná',
          description: 'Váš účet byl vytvořen. Zkontrolujte svůj email pro ověření.',
        });

        router.push('/auth/login');
      }
    } catch (error: any) {
      console.error('Comprehensive registration error:', error);
      
      toast({
        title: 'Chyba při registraci',
        description: error.message || 'Nepodařilo se vytvořit účet',
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
          <h1 className="text-2xl font-bold">Registrace</h1>
          <p className="text-muted-foreground mt-2">
            Vytvořte si účet v systému NeuronaLabs
          </p>
        </div>

        <form onSubmit={handleRegister} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium">
                  Jméno
                </label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  placeholder="Jan"
                  className="mt-1"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium">
                  Příjmení
                </label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  placeholder="Novák"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="vas@email.cz"
                className="mt-1"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Heslo
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="mt-1"
                minLength={6}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Heslo musí mít alespoň 6 znaků
              </p>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Registrace...' : 'Zaregistrovat se'}
            </Button>
          </div>

          <div className="text-center text-sm">
            Již máte účet?{' '}
            <Link href="/auth/login" className="text-primary hover:underline">
              Přihlaste se
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
