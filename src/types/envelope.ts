export type Envelope<T> = {
  success: boolean;
  data: T | null;
  error: string | null;
  pagination: Pagination | null;
};
export interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
  filters?: Record<string, string | number | boolean | null>; // Acepta varios tipos para filtros
}

export interface TableData<T> {
  items: T[];
  pagination: Pagination | null;
}
