import { sortByToState } from '@/lib/table';
import { Prisma, property } from '@prisma/client';
import { getProperties } from '../private/admin/[tab_id]/actions';
import { DataTableDemo } from './page.client';

type PruebasTableProps = {
  searchParams: {
    property_page?: string;
    property_limit?: string;
    property_sort_by?: string;
    property_sort_direction?: string;
    property_filter?: string;
  };
};

async function PruebasTable({ searchParams }: PruebasTableProps) {
  const {
    property_filter,
    property_limit,
    property_page,
    property_sort_by,
    property_sort_direction,
  } = searchParams;

  let sorted_by: Prisma.propertyOrderByWithRelationInput = {};
  const sortingState = sortByToState({
    sort_by: property_sort_by ?? '',
    sort_direction: property_sort_direction ?? '',
  });

  if (property_sort_by && property_sort_direction) {
    sorted_by = {
      [property_sort_by]: property_sort_direction,
    };
  }

  const propertyRecords = await getProperties({
    page: property_page ? Number(property_page) : undefined,
    limit: property_limit ? Number(property_limit) : undefined,
    order_by: sorted_by,
    filter: {
      taxpayer: {
        contains: property_filter,
      },
    },
  });

  return (
    <main className='max-w-6xl mx-auto py-4'>
      <DataTableDemo<property>
        data={propertyRecords}
        sorting={sortingState}
        filter={property_filter ?? ''}
      />
    </main>
  );
}
export default PruebasTable;
