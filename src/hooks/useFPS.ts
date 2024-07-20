import { useCallback, useMemo } from 'react';
import { QueryParams, useQueryParams } from './useQueryParams';
import { Pagination } from '@/types/envelope';

const LSItemsPerPageKey = 'items-per-page';

const getLSItemsPerPageValue = (items_per_page_key: string) => {
  const localItemsPerPageDictionary = JSON.parse(
    globalThis.localStorage?.getItem(LSItemsPerPageKey) ?? '{}'
  );
  return localItemsPerPageDictionary[items_per_page_key] ?? 5;
};

const saveItemsPerPageValueInLS = (
  items_per_page_key: string,
  newValue?: string | number
) => {
  const localItemsPerPageDictionary = JSON.parse(
    globalThis.localStorage?.getItem(LSItemsPerPageKey) ?? '{}'
  );

  if (newValue || !localItemsPerPageDictionary[items_per_page_key]) {
    localItemsPerPageDictionary[items_per_page_key] = +(newValue ?? 5);

    globalThis.localStorage.setItem(
      LSItemsPerPageKey,
      JSON.stringify(localItemsPerPageDictionary)
    );
  }
};

export function useFPS<T>(input: {
  // items_per_page_key: string;
  query_id?: string;
  pagination?: Pagination;
}) {
  const { query_id, pagination } = input;
  const { updateURLQuery, getQueryValue, generateQuery } = useQueryParams();

  const { ...queries } = generateQuery();

  const pageKey = `${query_id ? query_id + '_' : ''}page`;
  const limitPerPageKey = `${query_id ? query_id + '_' : ''}limit`;
  const sortByKey = `${query_id ? query_id + '_' : ''}sort_by`;
  const sortDirectionKey = `${query_id ? query_id + '_' : ''}sort_direction`;

  const page = queries[pageKey];
  const items_per_page = queries[limitPerPageKey];
  const sort_by = queries[sortByKey];
  const sort_direction = queries[sortDirectionKey];

  const handleFilter = useCallback(
    (filter: QueryParams) => {
      updateURLQuery({
        ...filter,
        [pageKey]: 1,
      });
    },
    [updateURLQuery, pageKey]
  );

  const handlePagination = useCallback(
    (input: { page: number; limit: number }) => {
      updateURLQuery({
        [pageKey]: input.page,
        [limitPerPageKey]: input.limit,
      });
    },
    [updateURLQuery, pageKey, limitPerPageKey]
  );

  const handleSort = useCallback(
    (input: { sort_by: string; sort_direction: string }) => {
      const { sort_by, sort_direction } = input;
      const previousField = getQueryValue(sortByKey);
      const previousDirection = getQueryValue(sortDirectionKey) ?? 'ascend';

      if (previousDirection !== sort_direction || previousField !== sort_by) {
        updateURLQuery({
          [sortByKey]: sort_by,
          [sortDirectionKey]: sort_direction,
        });
      }
    },
    [updateURLQuery, getQueryValue, sortByKey, sortDirectionKey]
  );

  // saveItemsPerPageValueInLS(
  //   input.items_per_page_key,
  //   items_per_page as string | undefined
  // );

  // const { data, isLoading, isRefetching, refetch, error } =
  //   input.trpc_query.useQuery(
  //     {
  //       page,
  //       items_per_page: getLSItemsPerPageValue(input.items_per_page_key),
  //       sort_by,
  //       sort_direction,
  //       ...queries,
  //       ...(input.fixed_values ?? {}),
  //     },
  //     { refetchOnWindowFocus: false }
  //   );

  // const updatedPagination = useMemo(() => {
  //   return {
  //     pageSize: items_per_page
  //       ? +items_per_page
  //       : getLSItemsPerPageValue(input.items_per_page_key),
  //     pageSizeOptions: ['5', '10', '25', '50'],
  //     showSizeChanger: true,
  //     total: pagination?.total_items ?? 0,
  //     current: page ? +page : 1,
  //   };
  // }, [pagination, items_per_page, page, input.items_per_page_key]);

  return {
    pagination,
    handleFilter,
    handleSort,
    handlePagination,
    queries,
  };
}
