'use client';

import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export interface DataTableURLParams {
  page?: number;
  limit?: number;
  sortBy?: string | null;
  sortDirection?: 'asc' | 'desc' | null;
  filters?: Record<string, string>;
}

export interface UseDataTableURLParamsReturn {
  // Estado actual derivado de la URL
  currentPage: number;
  currentLimit: number;
  currentSortBy: string | null;
  currentSortDirection: 'asc' | 'desc' | null;
  activeFilters: Record<string, string>;
  // Funciones para manipular los parámetros de la URL
  createQueryString: (
    params: Record<
      string,
      string | number | null | Record<string, string | null>
    >
  ) => string;
  navigateWithParams: (
    newParams: Record<
      string,
      string | number | null | Record<string, string | null>
    >
  ) => void;
  handlePageChange: (page: number) => void;
  handleLimitChange: (limit: number) => void;
  handleSortingChange: (
    sortBy: string | null,
    sortDirection: 'asc' | 'desc' | null
  ) => void;
  handleFilterChange: (filterId: string, value: string | null) => void;
}

export function useDataTableURLParams({
  defaultLimit = 10,
}: { defaultLimit?: number } = {}): UseDataTableURLParamsReturn {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (
      params: Record<
        string,
        string | number | null | Record<string, string | null>
      >
    ) => {
      const newSearchParams = new URLSearchParams(
        searchParams?.toString() || ''
      );
      Object.entries(params).forEach(([key, value]) => {
        if (key === 'filters' && typeof value === 'object' && value !== null) {
          Array.from(newSearchParams.keys()).forEach((k) => {
            if (k.startsWith('filter.')) {
              newSearchParams.delete(k);
            }
          });
          Object.entries(value).forEach(([filterKey, filterValue]) => {
            if (filterValue === null || filterValue === '') {
              newSearchParams.delete(`filter.${filterKey}`);
            } else {
              newSearchParams.set(`filter.${filterKey}`, String(filterValue));
            }
          });
        } else if (value === null || String(value).trim() === '') {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      });
      return newSearchParams.toString();
    },
    [searchParams]
  );

  const activeFilters = useCallback(() => {
    const filters: Record<string, string> = {};
    Array.from(searchParams?.entries() || []).forEach(([key, value]) => {
      if (key.startsWith('filter.')) {
        filters[key.replace('filter.', '')] = value;
      }
    });
    return filters;
  }, [searchParams])();

  const navigateWithParams = useCallback(
    (
      newParams: Record<
        string,
        string | number | null | Record<string, string | null>
      >
    ) => {
      router.push(`${pathname}?${createQueryString(newParams)}`, {
        scroll: false,
      });
    },
    [pathname, router, createQueryString]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      navigateWithParams({ page });
    },
    [navigateWithParams]
  );

  const handleLimitChange = useCallback(
    (limit: number) => {
      navigateWithParams({ limit, page: 1 });
    },
    [navigateWithParams]
  );

  const handleSortingChange = useCallback(
    (sortBy: string | null, sortDirection: 'asc' | 'desc' | null) => {
      if (sortBy === null || sortBy === '' || sortDirection === null) {
        navigateWithParams({ sort_by: null, sort_direction: null, page: 1 });
      } else {
        navigateWithParams({
          sort_by: sortBy,
          sort_direction: sortDirection,
          page: 1,
        });
      }
    },
    [navigateWithParams]
  );

  const handleFilterChange = useCallback(
    (filterId: string, value: string | null) => {
      const currentFilters = { ...activeFilters };
      if (value === null) {
        delete currentFilters[filterId];
      } else {
        currentFilters[filterId] = value;
      }
      navigateWithParams({ filters: currentFilters, page: 1 });
    },
    [navigateWithParams, activeFilters]
  );

  // Valores actuales derivados de la URL
  const currentPage = parseInt(searchParams?.get('page') || '1', 10);
  const currentLimit = parseInt(
    searchParams?.get('limit') || String(defaultLimit),
    10
  );
  const currentSortBy = searchParams?.get('sort_by') || null;
  const currentSortDirection = searchParams?.get('sort_direction') as
    | 'asc'
    | 'desc'
    | null;

  return {
    currentPage: isNaN(currentPage) ? 1 : currentPage,
    currentLimit: isNaN(currentLimit) ? defaultLimit : currentLimit,
    currentSortBy,
    currentSortDirection,
    activeFilters,
    createQueryString,
    navigateWithParams,
    handlePageChange,
    handleLimitChange,
    handleSortingChange,
    handleFilterChange,
  };
}
