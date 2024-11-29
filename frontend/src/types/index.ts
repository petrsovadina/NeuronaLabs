export interface User {
  id: string;
  email: string;
  name: string;
  role: 'Admin' | 'Doctor' | 'Researcher';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  lastDiagnosis?: string;
  diagnosticData?: DiagnosticData[];
  dicomStudies?: DicomStudy[];
}

export interface DiagnosticData {
  id: string;
  patientId: string;
  type: string;
  data: Record<string, any>;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface DicomStudy {
  id: string;
  patientId: string;
  studyInstanceUID: string;
  studyDate: string;
  modality: string;
  description?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ApiError extends Error {
  statusCode?: number;
  errors?: Record<string, string[]>;
}
