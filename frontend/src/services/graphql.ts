import { GraphQLClient } from 'graphql-request';
import { useAuthStore } from '@/store/auth';

const endpoint =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/graphql';

export const graphqlClient = new GraphQLClient(endpoint, {
  credentials: 'include',
  mode: 'cors',
});

// Add auth token to requests
graphqlClient.requestConfig = {
  getHeaders: () => {
    const token = useAuthStore.getState().token;
    return {
      Authorization: token ? `Bearer ${token}` : '',
    };
  },
};

// GraphQL Queries
export const QUERIES = {
  GET_PATIENTS: `
    query GetPatients($page: Int!, $pageSize: Int!) {
      patients(page: $page, pageSize: $pageSize) {
        items {
          id
          name
          dateOfBirth
          gender
          lastDiagnosis
        }
        total
        page
        pageSize
        hasMore
      }
    }
  `,

  GET_PATIENT: `
    query GetPatient($id: ID!) {
      patient(id: $id) {
        id
        name
        dateOfBirth
        gender
        lastDiagnosis
        diagnosticData {
          id
          type
          data
          createdAt
          metadata
        }
        dicomStudies {
          id
          studyInstanceUID
          studyDate
          modality
          description
        }
      }
    }
  `,
};

// GraphQL Mutations
export const MUTATIONS = {
  LOGIN: `
    mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        token
        user {
          id
          email
          role
          name
        }
      }
    }
  `,

  CREATE_PATIENT: `
    mutation CreatePatient($input: PatientInput!) {
      createPatient(input: $input) {
        id
        name
        dateOfBirth
        gender
        lastDiagnosis
      }
    }
  `,

  UPDATE_PATIENT: `
    mutation UpdatePatient($id: ID!, $input: PatientInput!) {
      updatePatient(id: $id, input: $input) {
        id
        name
        dateOfBirth
        gender
        lastDiagnosis
      }
    }
  `,

  DELETE_PATIENT: `
    mutation DeletePatient($id: ID!) {
      deletePatient(id: $id)
    }
  `,

  ADD_DIAGNOSTIC_DATA: `
    mutation AddDiagnosticData($patientId: ID!, $input: DiagnosticDataInput!) {
      addDiagnosticData(patientId: $patientId, input: $input) {
        id
        type
        data
        createdAt
        metadata
      }
    }
  `,

  ADD_DICOM_STUDY: `
    mutation AddDicomStudy($patientId: ID!, $input: DicomStudyInput!) {
      addDicomStudy(patientId: $patientId, input: $input) {
        id
        studyInstanceUID
        studyDate
        modality
        description
      }
    }
  `,
};
