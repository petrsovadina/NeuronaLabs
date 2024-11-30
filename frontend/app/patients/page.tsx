import { Metadata } from 'next';
import PatientList from '@/components/patients/patient-list';

export const metadata: Metadata = {
  title: 'Pacienti | NeuronaLabs',
  description: 'Seznam pacientů a jejich správa',
};

export default function PatientsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <PatientList />
    </div>
  );
}
