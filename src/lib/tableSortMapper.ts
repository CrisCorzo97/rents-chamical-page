import { SortingState } from '@tanstack/react-table';

export type SortParams = { sort_by: string; sort_direction: string };

export const stateToSortBy = (
  sorting: SortingState | undefined
): SortParams => {
  if (!sorting || sorting.length == 0)
    return { sort_by: '', sort_direction: '' };

  const sort = sorting[0];

  return {
    sort_by: sort.id,
    sort_direction: sort.desc ? 'desc' : 'asc',
  };
};

export const sortByToState = (
  newSort: SortParams | undefined
): SortingState => {
  if (!newSort?.sort_by) return [];

  return [{ id: newSort.sort_by, desc: newSort.sort_direction === 'desc' }];
};
