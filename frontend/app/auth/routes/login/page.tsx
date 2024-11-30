import { LoginForm } from '@/components/auth/LoginForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Přihlášení - NeuronaLabs',
  description: 'Přihlaste se do systému NeuronaLabs'
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Přihlášení</CardTitle>
          <CardDescription>
            Přihlaste se do systému NeuronaLabs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <div className="mt-4 text-center text-sm">
            Nemáte ještě účet?{' '}
            <Link href="/auth/register" className="text-blue-600 hover:underline">
              Zaregistrujte se
            </Link>
            <div className="mt-2">
              <Link href="/auth/reset-password" className="text-sm text-gray-600 hover:underline">
                Zapomněli jste heslo?
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
