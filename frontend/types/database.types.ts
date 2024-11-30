export type DoctorRole = 'doctor' | 'admin' | 'researcher';
export type StudyModality = 'CT' | 'MRI' | 'PET' | 'XRAY' | 'ULTRASOUND';
export type StudyStatus = 'new' | 'in_progress' | 'diagnosed' | 'archived';
export type GenderType = 'M' | 'F' | 'O';

export interface Doctor {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  role: DoctorRole;
  specialization: string | null;
  license_number: string;
  institution: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  personal_id: string;
  gender: GenderType;
  email: string | null;
  phone: string | null;
  address: string | null;
  insurance_number: string | null;
  insurance_provider: string | null;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface DicomStudy {
  id: string;
  patient_id: string;
  doctor_id: string;
  dicom_uid: string;
  modality: StudyModality;
  study_date: string;
  accession_number: string | null;
  study_description: string | null;
  status: StudyStatus;
  folder_path: string;
  number_of_images: number;
  study_size: number;
  metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface DicomSeries {
  id: string;
  study_id: string;
  series_uid: string;
  series_number: number | null;
  series_description: string | null;
  modality: StudyModality;
  number_of_images: number;
  folder_path: string;
  metadata: Record<string, any> | null;
  created_at: string;
}

export interface DicomInstance {
  id: string;
  series_id: string;
  instance_uid: string;
  instance_number: number | null;
  file_path: string;
  file_size: number;
  metadata: Record<string, any> | null;
  created_at: string;
}

export interface Diagnosis {
  id: string;
  study_id: string;
  doctor_id: string;
  diagnosis_text: string;
  findings: string | null;
  recommendations: string | null;
  created_at: string;
  updated_at: string;
}

export interface StudyNote {
  id: string;
  study_id: string;
  doctor_id: string;
  note_text: string;
  is_private: boolean;
  created_at: string;
  updated_at: string;
}

export interface StudyMeasurement {
  id: string;
  study_id: string;
  instance_id: string;
  doctor_id: string;
  measurement_type: string;
  measurement_data: Record<string, any>;
  created_at: string;
}

export interface AuditLog {
  id: string;
  doctor_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: Record<string, any> | null;
  ip_address: string | null;
  created_at: string;
}
