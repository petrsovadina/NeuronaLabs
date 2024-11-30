'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  insurance_number: string;
}

export function RecentPatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchPatients = async () => {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching patients:', error);
        return;
      }

      setPatients(data);
      setLoading(false);
    };

    fetchPatients();
  }, [supabase]);

  if (loading) {
    return <div>Načítání...</div>;
  }

  return (
    <div className="space-y-8">
      {patients.map((patient) => {
        const initials = `${patient.first_name[0]}${patient.last_name[0]}`;
        return (
          <div key={patient.id} className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <Link
                href={`/patients/${patient.id}`}
                className="text-sm font-medium leading-none hover:underline"
              >
                {patient.first_name} {patient.last_name}
              </Link>
              <p className="text-sm text-muted-foreground">
                {new Date(patient.birth_date).toLocaleDateString('cs-CZ')}
              </p>
            </div>
            <div className="ml-auto font-medium">
              {patient.insurance_number}
            </div>
          </div>
        );
      })}
    </div>
  );
}
