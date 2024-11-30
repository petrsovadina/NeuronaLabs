'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginSchema } from '@/lib/validation';
import { authService } from '@/lib/supabase';
import Link from 'next/link';

type LoginFormData = {
  email: string;
  password: string;
};

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null);
      
      // Přihlášení pomocí Supabase autentizační služby
      await authService.signIn(data.email, data.password);
      
      // Přesměrování na dashboard po úspěšném přihlášení
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      console.error('Login error:', err);
      
      // Detailnější zpracování chyb
      if (err instanceof Error) {
        switch (err.message) {
          case 'Invalid login credentials':
            setError('Nesprávné přihlašovací údaje. Zkontrolujte email a heslo.');
            break;
          case 'Email not confirmed':
            setError('Email ještě nebyl ověřen. Zkontrolujte svou emailovou schránku.');
            break;
          default:
            setError('Nastala neočekávaná chyba. Zkuste to prosím znovu.');
        }
      } else {
        setError('Nastala neočekávaná chyba při přihlašování.');
      }
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Přihlášení</CardTitle>
        <CardDescription>
          Přihlaste se do svého účtu v systému NeuronaLabs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(onSubmit)} 
            className="space-y-4"
          >
            {error && (
              <div className="bg-red-100 text-red-600 p-3 rounded">
                {error}
              </div>
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="vas@email.cz"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Heslo</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="********"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'Přihlašování...' : 'Přihlásit se'}
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-center text-sm">
          <Link 
            href="/auth/reset-password" 
            className="text-blue-600 hover:underline"
          >
            Zapomněli jste heslo?
          </Link>
          <div className="mt-2">
            Nemáte účet?{' '}
            <Link 
              href="/auth/register" 
              className="text-blue-600 hover:underline"
            >
              Zaregistrujte se
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
