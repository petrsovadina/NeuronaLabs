import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Obnovení hesla - NeuronaLabs',
  description: 'Obnovte si heslo v systému NeuronaLabs'
};

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Obnovení hesla</CardTitle>
          <CardDescription>
            Zadejte svůj email pro obnovení hesla
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm />
          <div className="mt-4 text-center text-sm">
            Vzpomněli jste si na heslo?{' '}
            <Link href="/auth/login" className="text-blue-600 hover:underline">
              Přihlaste se
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
