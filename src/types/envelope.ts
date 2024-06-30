export interface Envelope<T> {
  success: boolean;
  data: T | null;
  error?: string;
  pagination: {
    total_pages: number;
    total_items: number;
    page: number;
    limit_per_page: number;
  } | null;
}
