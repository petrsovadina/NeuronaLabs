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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Register the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (authError) throw authError;

      if (authData?.user) {
        // Create user profile in the users table
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              email,
              first_name: firstName,
              last_name: lastName,
              role: 'doctor', // Default role
            },
          ]);

        if (profileError) throw profileError;

        toast({
          title: 'Registrace úspěšná',
          description: 'Váš účet byl vytvořen. Nyní se můžete přihlásit.',
        });

        router.push('/auth/login');
      }
    } catch (error: any) {
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
