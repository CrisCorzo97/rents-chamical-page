import { sortByToState } from '@/lib/table';
import { getProperties } from '../private/dashboard/actions';
import { DataTableDemo } from './page.client';
import { Prisma, property } from '@prisma/client';

type PruebasTableProps = {
  searchParams: {
    property_page: string;
    property_limit: string;
    property_sort_by: string;
    property_sort_direction: string;
  };
};

async function PruebasTable({ searchParams }: PruebasTableProps) {
  let sorted_by: Prisma.propertyOrderByWithRelationInput = {};
  const sortingState = sortByToState({
    sort_by: searchParams.property_sort_by,
    sort_direction: searchParams.property_sort_direction,
  });

  if (searchParams.property_sort_by && searchParams.property_sort_direction) {
    sorted_by = {
      [searchParams.property_sort_by]: searchParams.property_sort_direction,
    };
  }

  const propertyRecords = await getProperties({
    page: Number(searchParams.property_page),
    limit: Number(searchParams.property_limit),
    order_by: sorted_by,
  });

  return (
    <main className='max-w-6xl mx-auto py-4'>
      <DataTableDemo<property> data={propertyRecords} sorting={sortingState} />
    </main>
  );
}
export default PruebasTable;
