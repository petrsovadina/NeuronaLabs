'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();
  const supabase = createClientComponentClient();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (error) throw error;

      setSent(true);
      toast({
        title: 'Email odeslán',
        description: 'Zkontrolujte svou emailovou schránku pro další instrukce.',
      });
    } catch (error: any) {
      toast({
        title: 'Chyba',
        description: error.message || 'Nepodařilo se odeslat email pro reset hesla',
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
          <h1 className="text-2xl font-bold">Reset hesla</h1>
          <p className="text-muted-foreground mt-2">
            Zadejte svůj email pro reset hesla
          </p>
        </div>

        {sent ? (
          <div className="text-center space-y-4">
            <p>
              Pokud máte u nás účet, poslali jsme vám email s instrukcemi pro reset hesla.
            </p>
            <Link href="/auth/login" className="text-primary hover:underline">
              Zpět na přihlášení
            </Link>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="mt-8 space-y-6">
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
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Odesílání...' : 'Odeslat instrukce'}
              </Button>
            </div>

            <div className="text-center text-sm">
              <Link href="/auth/login" className="text-primary hover:underline">
                Zpět na přihlášení
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
