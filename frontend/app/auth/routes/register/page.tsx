import { RegisterForm } from '@/components/auth/RegisterForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Registrace - NeuronaLabs',
  description: 'Vytvořte si nový účet v systému NeuronaLabs'
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Registrace</CardTitle>
          <CardDescription>
            Vytvořte si nový účet v systému NeuronaLabs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
          <div className="mt-4 text-center text-sm">
            Již máte účet?{' '}
            <Link href="/auth/login" className="text-blue-600 hover:underline">
              Přihlaste se
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
