import {
  ApiError,
  ApiResponse,
  FilterParams,
  PaginationParams,
} from '@/types/api';
import { supabase } from './supabase/client';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  private async getAuthHeaders() {
    const { data: { session } } = await supabase.auth.getSession();
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.access_token || ''}`,
    };
  }

  private async handleResponse(response) {
    if (!response.ok) {
      if (response.status === 401) {
        // Automatické přesměrování na login při vypršení session
        window.location.href = `/login?returnUrl=${encodeURIComponent(window.location.pathname)}`;
      }
      const error = await response.json();
      throw new Error(error.message || 'An error occurred');
    }
    return response.json();
  }

  private buildUrl(endpoint, params) {
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

  async get(endpoint, params) {
    const headers = await this.getAuthHeaders();
    const response = await fetch(this.buildUrl(endpoint, params), { headers });
    return this.handleResponse(response);
  }

  async post(endpoint, data) {
    const headers = await this.getAuthHeaders();
    const response = await fetch(this.buildUrl(endpoint), {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async put(endpoint, data) {
    const headers = await this.getAuthHeaders();
    const response = await fetch(this.buildUrl(endpoint), {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async delete(endpoint) {
    const headers = await this.getAuthHeaders();
    const response = await fetch(this.buildUrl(endpoint), {
      method: 'DELETE',
      headers,
    });
    return this.handleResponse(response);
  }
}

export const apiClient = new ApiClient();
