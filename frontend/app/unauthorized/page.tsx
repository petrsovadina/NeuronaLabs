import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="w-16 h-16 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          Nedostatečná oprávnění
        </h1>
        <p className="text-gray-600 mb-6">
          Nemáte oprávnění pro přístup k této stránce. 
          Kontaktujte správce systému, pokud se domníváte, že jde o chybu.
        </p>
        <div className="flex justify-center space-x-4">
          <Button asChild variant="outline">
            <Link href="/dashboard">Zpět na nástěnku</Link>
          </Button>
          <Button asChild>
            <Link href="/profile">Upravit profil</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
