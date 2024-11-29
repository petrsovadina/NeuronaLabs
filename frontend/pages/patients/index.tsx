import { withAuth } from '@/components/auth/withAuth';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useRouter } from 'next/router';
import { useState } from 'react';

function PatientsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // Mockovaná data pacientů - později nahradit real daty
  const patients = [
    { id: 1, name: 'Jan Novák', birthDate: '1980-05-15', lastVisit: '2024-03-15' },
    { id: 2, name: 'Marie Svobodová', birthDate: '1992-08-22', lastVisit: '2024-03-14' },
    { id: 3, name: 'Petr Dvořák', birthDate: '1975-11-30', lastVisit: '2024-03-13' },
  ];

  return (
    <Container>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Pacienti</h1>
          <Button onClick={() => router.push('/patients/new')}>
            Nový pacient
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <Input
            placeholder="Vyhledat pacienta..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Jméno</TableHead>
              <TableHead>Datum narození</TableHead>
              <TableHead>Poslední návštěva</TableHead>
              <TableHead>Akce</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>{patient.name}</TableCell>
                <TableCell>{patient.birthDate}</TableCell>
                <TableCell>{patient.lastVisit}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    onClick={() => router.push(`/patients/${patient.id}`)}
                  >
                    Detail
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Container>
  );
}

export default withAuth(PatientsPage);
