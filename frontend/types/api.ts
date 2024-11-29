export type ApiResponse<T> = {
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  metadata?: {
    page?: number;
    limit?: number;
    total?: number;
  };
};

export type PaginationParams = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

export type FilterParams = {
  search?: string;
  startDate?: string;
  endDate?: string;
  [key: string]: string | undefined;
};

export type ApiError = {
  code: string;
  message: string;
  details?: unknown;
};
