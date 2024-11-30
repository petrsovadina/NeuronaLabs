'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';

export function UpcomingAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function loadUpcomingAppointments() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data } = await supabase
        .from('appointments')
        .select(
          `
          *,
          patient:patients(first_name, last_name)
        `
        )
        .eq('doctor_id', user?.id)
        .gte('appointment_date', new Date().toISOString())
        .order('appointment_date', { ascending: true })
        .limit(5);

      if (data) {
        setAppointments(data);
      }
    }

    loadUpcomingAppointments();
  }, [supabase]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nadcházející schůzky</CardTitle>
        <CardDescription>Nejbližších 5 naplánovaných schůzek</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.map(appointment => (
            <div
              key={appointment.id}
              className="flex items-center justify-between"
            >
              <div className="space-y-1">
                <p className="font-medium leading-none">
                  {appointment.patient.first_name}{' '}
                  {appointment.patient.last_name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(appointment.appointment_date).toLocaleString(
                    'cs-CZ'
                  )}
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                {appointment.type}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
