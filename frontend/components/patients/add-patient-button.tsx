'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { PatientForm } from './patient-form';

export function AddPatientButton() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Přidat pacienta</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Přidat nového pacienta</DialogTitle>
          <DialogDescription>
            Vyplňte základní informace o pacientovi. Další údaje můžete doplnit
            později.
          </DialogDescription>
        </DialogHeader>
        <PatientForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
