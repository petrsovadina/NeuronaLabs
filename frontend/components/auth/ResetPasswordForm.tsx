'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authService } from '@/lib/supabase';
import Link from 'next/link';

// Schéma pro reset hesla
const ResetPasswordSchema = z.object({
  email: z.string().email('Neplatný formát emailu'),
});

type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setError(null);
      setSuccess(null);

      // Odeslání požadavku na reset hesla
      await authService.resetPasswordRequest(data.email);

      // Nastavení úspěšné zprávy
      setSuccess('Odkaz pro reset hesla byl odeslán na váš email.');
      
      // Volitelné přesměrování po úspěšném odeslání
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } catch (err) {
      console.error('Reset hesla selhal:', err);
      
      // Detailní zpracování chyb
      if (err instanceof Error) {
        switch (err.message) {
          case 'User not found':
            setError('Uživatel s tímto emailem nebyl nalezen.');
            break;
          case 'Rate limit exceeded':
            setError('Příliš mnoho požadavků. Zkuste to prosím později.');
            break;
          default:
            setError('Nepodařilo se odeslat reset hesla. Zkuste to prosím znovu.');
        }
      } else {
        setError('Nastala neočekávaná chyba při resetu hesla.');
      }
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Obnovení hesla</CardTitle>
        <CardDescription>
          Zadejte svůj email pro obnovení hesla
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

            {success && (
              <div className="bg-green-100 text-green-600 p-3 rounded">
                {success}
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

            <Button 
              type="submit" 
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'Odesílání...' : 'Obnovit heslo'}
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-center text-sm">
          <Link 
            href="/auth/login" 
            className="text-blue-600 hover:underline"
          >
            Zpět na přihlášení
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
