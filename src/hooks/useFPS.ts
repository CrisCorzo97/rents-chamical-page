import { useCallback } from 'react';
import { QueryParams, useQueryParams } from './useQueryParams';
import { Pagination } from '@/types/envelope';

export function useFPS(input: { query_id?: string; pagination?: Pagination }) {
  const { query_id, pagination } = input;
  const { updateURLQuery, generateQuery, getUpdatedURLQuery } =
    useQueryParams();

  const { ...queries } = generateQuery();

  const pageKey = `${query_id ? query_id + '_' : ''}page`;
  const limitKey = `${query_id ? query_id + '_' : ''}limit`;
  const sortByKey = `${query_id ? query_id + '_' : ''}sort_by`;
  const sortDirectionKey = `${query_id ? query_id + '_' : ''}sort_direction`;

  const handleFilter = useCallback(
    (filter: QueryParams) => {
      return updateURLQuery({
        ...filter,
        [pageKey]: 1,
      });
    },
    [updateURLQuery, pageKey]
  );

  const handlePagination = useCallback(
    (input: { page: number; limit: number }, options?: { getUrl: boolean }) => {
      if (options?.getUrl) {
        return getUpdatedURLQuery({
          [pageKey]: input.page,
          [limitKey]: input.limit,
        });
      } else {
        return updateURLQuery({
          [pageKey]: input.page,
          [limitKey]: input.limit,
        });
      }
    },
    [updateURLQuery, getUpdatedURLQuery, pageKey, limitKey]
  );

  const handleSort = useCallback(
    (input: { sort_by: string; sort_direction: string }) => {
      const { sort_by, sort_direction } = input;

      updateURLQuery({
        [sortByKey]: sort_by,
        [sortDirectionKey]: sort_direction,
      });
    },
    [updateURLQuery, sortByKey, sortDirectionKey]
  );

  return {
    pagination,
    handleFilter,
    handleSort,
    handlePagination,
    queries,
  };
}
