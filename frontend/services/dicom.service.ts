import { apiClient } from '@/lib/api-client';
import { ApiResponse, FilterParams, PaginationParams } from '@/types/api';
import { DicomStudy, DicomStudyFormData } from '@/types/dicom';

export class DicomService {
  private static readonly BASE_PATH = '/dicom';

  static async getStudies(
    params?: PaginationParams & FilterParams
  ): Promise<ApiResponse<DicomStudy[]>> {
    return apiClient.get<DicomStudy[]>(`${this.BASE_PATH}/studies`, params);
  }

  static async getStudy(
    studyInstanceUID: string
  ): Promise<ApiResponse<DicomStudy>> {
    return apiClient.get<DicomStudy>(
      `${this.BASE_PATH}/studies/${studyInstanceUID}`
    );
  }

  static async getPatientStudies(
    patientId: string,
    params?: PaginationParams
  ): Promise<ApiResponse<DicomStudy[]>> {
    return apiClient.get<DicomStudy[]>(
      `${this.BASE_PATH}/patients/${patientId}/studies`,
      params
    );
  }

  static async createStudy(
    data: DicomStudyFormData
  ): Promise<ApiResponse<DicomStudy>> {
    return apiClient.post<DicomStudy>(`${this.BASE_PATH}/studies`, data);
  }

  static async updateStudy(
    studyInstanceUID: string,
    data: DicomStudyFormData
  ): Promise<ApiResponse<DicomStudy>> {
    return apiClient.put<DicomStudy>(
      `${this.BASE_PATH}/studies/${studyInstanceUID}`,
      data
    );
  }

  static async deleteStudy(
    studyInstanceUID: string
  ): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(
      `${this.BASE_PATH}/studies/${studyInstanceUID}`
    );
  }
}
