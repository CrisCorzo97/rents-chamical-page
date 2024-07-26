import { sortByToState } from '@/lib/tableSortMapper';
import { getProperties } from '../private/dashboard/actions';
import { DataTableDemo } from './page.client';
import { Prisma, property } from '@prisma/client';

type PruebasTableProps = {
  searchParams: {
    page: string;
    limit: string;
    sort_by: string;
    sort_direction: string;
  };
};

async function PruebasTable({ searchParams }: PruebasTableProps) {
  let sorted_by: Prisma.propertyOrderByWithRelationInput = {};
  const sortingState = sortByToState({
    sort_by: searchParams.sort_by,
    sort_direction: searchParams.sort_direction,
  });

  if (searchParams.sort_by && searchParams.sort_direction) {
    sorted_by = {
      [searchParams.sort_by]: searchParams.sort_direction,
    };
  }

  const propertyRecords = await getProperties({
    page: Number(searchParams.page),
    limit: Number(searchParams.limit),
    order_by: sorted_by,
  });

  return (
    <main className='max-w-6xl mx-auto py-4'>
      <DataTableDemo<property> data={propertyRecords} sorting={sortingState} />
    </main>
  );
}
export default PruebasTable;
