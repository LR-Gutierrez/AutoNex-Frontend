export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

export interface PagedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface AppError {
  message: string;
  validationErrors?: Record<string, string[]>;
}
