export type Envelope<T> = {
  success: boolean;
  data: T | null;
  error: string | null;
  pagination: Pagination | null;
};

export type Pagination = {
  total_pages: number;
  total_items: number;
  page: number;
  limit_per_page: number;
};
