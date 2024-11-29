import React from 'react';
import { redirect } from 'next/navigation';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/store/auth';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          <Skeleton className="h-24 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Head>
        <title>NeuronaLabs - Zdravotnický systém</title>
        <meta name="description" content="Komplexní řešení pro správu zdravotnických dat" />
      </Head>

      <main className="container mx-auto px-4 py-16 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
              NeuronaLabs
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Inteligentní platforma pro správu zdravotnických dat a lékařských záznamů
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <span>Pacienti</span>
                </CardTitle>
                <CardDescription>
                  Komplexní správa pacientských záznamů
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Spravujte kompletní zdravotní dokumentaci, historii léčby a osobní údaje pacientů.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => router.push('/patients')} 
                  className="w-full"
                >
                  Zobrazit pacienty
                </Button>
              </CardFooter>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <span>DICOM Prohlížeč</span>
                </CardTitle>
                <CardDescription>
                  Pokročilá analýza lékařských snímků
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Prohlížení a detailní analýza DICOM snímků s pokročilými nástroji.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => router.push('/dicom')} 
                  variant="secondary" 
                  className="w-full"
                >
                  Otevřít prohlížeč
                </Button>
              </CardFooter>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <span>Analytika</span>
                </CardTitle>
                <CardDescription>
                  Přehled a statistiky
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Generování přehledných statistik a reportů pro lepší rozhodování.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => router.push('/analytics')} 
                  variant="outline" 
                  className="w-full"
                >
                  Zobrazit analytiku
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              Potřebujete pomoc?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Náš tým podpory je připraven vám pomoci s jakýmkoliv problémem nebo dotazem.
            </p>
            <Button 
              onClick={() => router.push('/support')}
              size="lg"
            >
              Kontaktovat podporu
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
