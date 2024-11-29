export interface DicomStudy {
  id?: string;
  patientId: string;
  studyInstanceUID: string;
  studyDate?: string;
  studyDescription?: string;
  modality?: string;
  numberOfSeries?: number;
  numberOfInstances?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type DicomStudyFormData = Omit<DicomStudy, 'id' | 'createdAt' | 'updatedAt'>;
