'use client';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';

interface Patient {
  id: string;
  created_at: string;
  full_name: string;
  birth_number: string;
  insurance_company: string;
  last_visit: string | null;
  status: 'active' | 'inactive';
}

export default function PatientList() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data, error } = await supabase
          .from('patients')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPatients(data || []);
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [supabase]);

  const handleRowClick = (patientId: string) => {
    router.push(`/patients/${patientId}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Pacienti</h2>
        <Button onClick={() => router.push('/patients/new')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nový pacient
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Jméno</TableHead>
              <TableHead>Rodné číslo</TableHead>
              <TableHead>Pojišťovna</TableHead>
              <TableHead>Poslední návštěva</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-[250px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[150px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[80px]" />
                  </TableCell>
                </TableRow>
              ))
            ) : patients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Žádní pacienti nebyli nalezeni
                </TableCell>
              </TableRow>
            ) : (
              patients.map((patient) => (
                <TableRow
                  key={patient.id}
                  onClick={() => handleRowClick(patient.id)}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <TableCell className="font-medium">
                    {patient.full_name}
                  </TableCell>
                  <TableCell>{patient.birth_number}</TableCell>
                  <TableCell>{patient.insurance_company}</TableCell>
                  <TableCell>
                    {patient.last_visit
                      ? format(new Date(patient.last_visit), 'PPp', {
                          locale: cs,
                        })
                      : 'Nikdy'}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        patient.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {patient.status === 'active' ? 'Aktivní' : 'Neaktivní'}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
