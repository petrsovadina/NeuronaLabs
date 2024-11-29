import { ApiResponse, ApiError, PaginationParams, FilterParams } from '@/types/api';
import { supabase } from './supabase/client';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  private async getAuthHeaders(): Promise<HeadersInit> {
    const { data: { session } } = await supabase.auth.getSession();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token || ''}`,
    };
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      if (response.status === 401) {
        // Automatické přesměrování na login při vypršení session
        window.location.href = `/login?returnUrl=${encodeURIComponent(window.location.pathname)}`;
      }
      const error = await response.json() as ApiError;
      throw new Error(error.message || 'An error occurred');
    }
    return response.json() as Promise<ApiResponse<T>>;
  }

  private buildUrl(endpoint: string, params?: Record<string, string | number | undefined>): string {
    const url = new URL(this.baseUrl + endpoint, window.location.origin);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    return url.toString();
  }

  async get<T>(
    endpoint: string,
    params?: PaginationParams & FilterParams
  ): Promise<ApiResponse<T>> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(this.buildUrl(endpoint, params), { headers });
    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(this.buildUrl(endpoint), {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(this.buildUrl(endpoint), {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(this.buildUrl(endpoint), {
      method: 'DELETE',
      headers,
    });
    return this.handleResponse<T>(response);
  }
}

export const apiClient = new ApiClient();
