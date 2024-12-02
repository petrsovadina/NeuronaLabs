export interface Patient {
    id: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    gender: 'male' | 'female' | 'other';
    email: string;
    phoneNumber?: string;
    address?: {
        street: string;
        city: string;
        postalCode: string;
        country: string;
    };
    medicalRecordNumber?: string;
    insuranceProvider?: string;
    allergies?: string[];
    emergencyContact?: {
        name: string;
        relationship: string;
        phoneNumber: string;
    };
}

export type PatientFormData = Omit<Patient, 'id'>;
