export interface Patient {
  id?: string;
  name: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  lastDiagnosis?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type PatientFormData = Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>;
