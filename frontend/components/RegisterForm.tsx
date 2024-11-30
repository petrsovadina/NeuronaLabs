'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;
      const firstName = formData.get('firstName') as string;
      const lastName = formData.get('lastName') as string;
      const specialization = formData.get('specialization') as string;
      const licenseNumber = formData.get('licenseNumber') as string;

      if (
        !email ||
        !password ||
        !firstName ||
        !lastName ||
        !specialization ||
        !licenseNumber
      ) {
        toast.error('Prosím vyplňte všechna povinná pole');
        return;
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
          data: {
            first_name: firstName,
            last_name: lastName,
            specialization: specialization,
            license_number: licenseNumber,
          },
        },
      });

      if (authError) {
        console.error('Auth error:', authError);
        if (authError.message === 'User already registered') {
          toast.error(
            'Tento email je již zaregistrován. Prosím přihlaste se nebo použijte jiný email.'
          );
          return;
        }
        throw authError;
      }

      if (authData.user) {
        const { error: profileError } = await supabase.from('users').insert([
          {
            id: authData.user.id,
            first_name: firstName,
            last_name: lastName,
            email: email,
            specialization: specialization,
            license_number: licenseNumber,
            role: 'doctor',
          },
        ]);

        if (profileError) {
          console.error('Profile error:', profileError);
          throw profileError;
        }

        toast.success(
          'Registrace byla úspěšná! Prosím zkontrolujte svůj email.'
        );
        router.push('/login');
      }
    } catch (error: any) {
      console.error('Error during registration:', error);
      toast.error(
        error.message || 'Chyba při registraci. Zkuste to prosím znovu.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="firstName">Jméno</Label>
        <Input
          id="firstName"
          name="firstName"
          placeholder="Jan"
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="lastName">Příjmení</Label>
        <Input
          id="lastName"
          name="lastName"
          placeholder="Novák"
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="jan.novak@example.com"
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Heslo</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          disabled={loading}
          minLength={6}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="specialization">Specializace</Label>
        <Input
          id="specialization"
          name="specialization"
          placeholder="Např. Neurolog"
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="licenseNumber">Číslo licence</Label>
        <Input
          id="licenseNumber"
          name="licenseNumber"
          placeholder="Zadejte číslo vaší licence"
          required
          disabled={loading}
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Registrace...' : 'Registrovat'}
      </Button>
    </form>
  );
}
