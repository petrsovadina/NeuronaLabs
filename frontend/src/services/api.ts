import { graphqlClient, QUERIES, MUTATIONS } from './graphql';
import {
  Patient,
  AuthResponse,
  PaginatedResponse,
  DiagnosticData,
  DicomStudy,
} from '@/types';

export const api = {
  auth: {
    login: async (email: string, password: string): Promise<AuthResponse> => {
      const response = await graphqlClient.request(MUTATIONS.LOGIN, {
        email,
        password,
      });
      return response.login;
    },
  },

  patients: {
    getAll: async (
      page: number,
      pageSize: number
    ): Promise<PaginatedResponse<Patient>> => {
      const response = await graphqlClient.request(QUERIES.GET_PATIENTS, {
        page,
        pageSize,
      });
      return response.patients;
    },

    getById: async (id: string): Promise<Patient> => {
      const response = await graphqlClient.request(QUERIES.GET_PATIENT, { id });
      return response.patient;
    },

    create: async (input: Omit<Patient, 'id'>): Promise<Patient> => {
      const response = await graphqlClient.request(MUTATIONS.CREATE_PATIENT, {
        input,
      });
      return response.createPatient;
    },

    update: async (
      id: string,
      input: Partial<Omit<Patient, 'id'>>
    ): Promise<Patient> => {
      const response = await graphqlClient.request(MUTATIONS.UPDATE_PATIENT, {
        id,
        input,
      });
      return response.updatePatient;
    },

    delete: async (id: string): Promise<boolean> => {
      const response = await graphqlClient.request(MUTATIONS.DELETE_PATIENT, {
        id,
      });
      return response.deletePatient;
    },
  },

  diagnosticData: {
    add: async (
      patientId: string,
      input: Omit<DiagnosticData, 'id' | 'patientId' | 'createdAt'>
    ): Promise<DiagnosticData> => {
      const response = await graphqlClient.request(MUTATIONS.ADD_DIAGNOSTIC_DATA, {
        patientId,
        input,
      });
      return response.addDiagnosticData;
    },
  },

  dicomStudies: {
    add: async (
      patientId: string,
      input: Omit<DicomStudy, 'id' | 'patientId'>
    ): Promise<DicomStudy> => {
      const response = await graphqlClient.request(MUTATIONS.ADD_DICOM_STUDY, {
        patientId,
        input,
      });
      return response.addDicomStudy;
    },
  },
};
