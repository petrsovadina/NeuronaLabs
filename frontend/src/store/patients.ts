import create from 'zustand';
import { Patient, PaginatedResponse } from '@/types';

interface PatientsState {
  patients: Patient[];
  selectedPatient: Patient | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    hasMore: boolean;
  };
  setPatients: (response: PaginatedResponse<Patient>) => void;
  setSelectedPatient: (patient: Patient | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addPatient: (patient: Patient) => void;
  updatePatient: (patient: Patient) => void;
  removePatient: (id: string) => void;
}

export const usePatientsStore = create<PatientsState>(set => ({
  patients: [],
  selectedPatient: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
    hasMore: false,
  },
  setPatients: response =>
    set({
      patients: response.items,
      pagination: {
        page: response.page,
        pageSize: response.pageSize,
        total: response.total,
        hasMore: response.hasMore,
      },
    }),
  setSelectedPatient: patient => set({ selectedPatient: patient }),
  setLoading: loading => set({ loading }),
  setError: error => set({ error }),
  addPatient: patient =>
    set(state => ({ patients: [...state.patients, patient] })),
  updatePatient: patient =>
    set(state => ({
      patients: state.patients.map(p => (p.id === patient.id ? patient : p)),
    })),
  removePatient: id =>
    set(state => ({
      patients: state.patients.filter(p => p.id !== id),
    })),
}));
