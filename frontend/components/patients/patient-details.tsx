'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { PatientForm } from './patient-form';

interface PatientDetailsProps {
  patient: any;
}

export function PatientDetails({ patient }: PatientDetailsProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const insuranceCompanies: { [key: string]: string } = {
    '111': 'VZP',
    '201': 'VOZP',
    '205': 'ČPZP',
    '207': 'OZP',
    '209': 'ZPŠ',
    '211': 'ZPMV',
    '213': 'RBP',
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogTrigger asChild>
            <Button>Upravit údaje</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Upravit údaje pacienta</DialogTitle>
            </DialogHeader>
            <PatientForm
              initialData={patient}
              onSuccess={() => setEditDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Osobní údaje</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2">
              <span className="font-medium">Pohlaví:</span>
              <span>
                {patient.gender === 'male'
                  ? 'Muž'
                  : patient.gender === 'female'
                    ? 'Žena'
                    : 'Jiné'}
              </span>
            </div>
            <div className="grid grid-cols-2">
              <span className="font-medium">Email:</span>
              <span>{patient.email || '-'}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="font-medium">Telefon:</span>
              <span>{patient.phone || '-'}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="font-medium">Adresa:</span>
              <span>{patient.address || '-'}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pojištění</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2">
              <span className="font-medium">Číslo pojištěnce:</span>
              <span>{patient.insurance_number}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="font-medium">Pojišťovna:</span>
              <span>{insuranceCompanies[patient.insurance_company]}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Zdravotní informace</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Anamnéza</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {patient.medical_history || 'Žádná anamnéza není k dispozici'}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Poznámky</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {patient.notes || 'Žádné poznámky nejsou k dispozici'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
