import Head from 'next/head';
import RegisterForm from '@/components/RegisterForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <>
      <Head>
        <title>Registrace | NeuronaLabs</title>
        <meta name="description" content="Zaregistrujte se do systému NeuronaLabs" />
      </Head>

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
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Již máte účet?{' '}
                <Link 
                  href="/login" 
                  className="font-medium text-primary hover:text-primary-dark"
                >
                  Přihlaste se
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
