import { apiClient } from '@/lib/api-client';
import { ApiResponse, FilterParams, PaginationParams } from '@/types/api';
import { Patient, PatientFormData } from '@/types/patient';

export class PatientService {
  private static readonly BASE_PATH = '/patients';

  static async getPatients(
    params?: PaginationParams & FilterParams
  ): Promise<ApiResponse<Patient[]>> {
    return apiClient.get<Patient[]>(this.BASE_PATH, params);
  }

  static async getPatient(id: string): Promise<ApiResponse<Patient>> {
    return apiClient.get<Patient>(`${this.BASE_PATH}/${id}`);
  }

  static async createPatient(
    data: PatientFormData
  ): Promise<ApiResponse<Patient>> {
    return apiClient.post<Patient>(this.BASE_PATH, data);
  }

  static async updatePatient(
    id: string,
    data: PatientFormData
  ): Promise<ApiResponse<Patient>> {
    return apiClient.put<Patient>(`${this.BASE_PATH}/${id}`, data);
  }

  static async deletePatient(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${this.BASE_PATH}/${id}`);
  }
}
