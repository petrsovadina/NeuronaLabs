'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ChevronLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';

interface Patient {
  id: string;
  created_at: string;
  full_name: string;
  birth_number: string;
  insurance_company: string;
  email: string;
  phone: string;
  address: string;
  last_visit: string | null;
  status: 'active' | 'inactive';
  notes: string | null;
}

export default function PatientPage() {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchPatient = async () => {
      if (!params.id) return;

      try {
        const { data, error } = await supabase
          .from('patients')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) {
          throw error;
        }

        setPatient(data);
      } catch (error) {
        console.error('Error fetching patient:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [params.id, supabase]);

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => router.back()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-8 w-[200px]" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4 space-y-4">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-[150px]" />
                <Skeleton className="h-4 w-[250px]" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-[300px]" />
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </CardContent>
            </Card>
          </div>
          <div className="col-span-3 space-y-4">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-[150px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[200px] w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => router.back()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight text-red-500">
            Pacient nenalezen
          </h2>
        </div>
        <p>Požadovaný pacient nebyl nalezen v databázi.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
          onClick={() => router.back()}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">
          {patient.full_name}
        </h2>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Přehled</TabsTrigger>
          <TabsTrigger value="examinations">Vyšetření</TabsTrigger>
          <TabsTrigger value="documents">Dokumenty</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Osobní údaje</CardTitle>
                  <CardDescription>
                    Základní informace o pacientovi
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Rodné číslo
                      </p>
                      <p>{patient.birth_number}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Pojišťovna
                      </p>
                      <p>{patient.insurance_company}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Status
                      </p>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          patient.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {patient.status === 'active' ? 'Aktivní' : 'Neaktivní'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Email
                    </p>
                    <p>{patient.email || 'Není uvedeno'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Telefon
                    </p>
                    <p>{patient.phone || 'Není uvedeno'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Adresa
                    </p>
                    <p>{patient.address || 'Není uvedeno'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Poslední návštěva
                    </p>
                    <p>
                      {patient.last_visit
                        ? format(new Date(patient.last_visit), 'PPp', {
                            locale: cs,
                          })
                        : 'Nikdy'}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Poznámky</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {patient.notes || 'Žádné poznámky'}
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="col-span-3 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Historie vyšetření</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Žádná vyšetření k zobrazení
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="examinations">
          <Card>
            <CardHeader>
              <CardTitle>Vyšetření</CardTitle>
              <CardDescription>
                Seznam všech vyšetření pacienta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Žádná vyšetření k zobrazení
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Dokumenty</CardTitle>
              <CardDescription>
                Nahrané dokumenty a zprávy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Žádné dokumenty k zobrazení
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
