'use client';

import { Button } from '@/components/ui/button';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ThemeToggle } from './theme-toggle';

export function Navigation() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold">
              NeuronaLabs
            </Link>
            {user && (
              <div className="hidden md:flex space-x-6">
                <Link
                  href="/patients"
                  className={`hover:text-primary ${
                    pathname === '/patients'
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  Pacienti
                </Link>
                <Link
                  href="/diagnostics"
                  className={`hover:text-primary ${
                    pathname === '/diagnostics'
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  Diagnostika
                </Link>
                <Link
                  href="/reports"
                  className={`hover:text-primary ${
                    pathname === '/reports'
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  Zprávy
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center space-x-4">
                <Link href="/profile">
                  <Button variant="ghost">Profil</Button>
                </Link>
                <Button onClick={handleSignOut} variant="outline">
                  Odhlásit
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login">
                  <Button variant="ghost">Přihlásit</Button>
                </Link>
                <Link href="/register">
                  <Button>Registrovat</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
