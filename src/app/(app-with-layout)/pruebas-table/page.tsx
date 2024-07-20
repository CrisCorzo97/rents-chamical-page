import { getProperties } from '../private/dashboard/actions';
import { DataTableDemo } from './page.client';
import { property } from '@prisma/client';

type PruebasTableProps = {
  searchParams: {
    page: string;
    limit: string;
  };
};

async function PruebasTable({ searchParams }: PruebasTableProps) {
  const propertyRecords = await getProperties({
    page: Number(searchParams.page),
    limit: Number(searchParams.limit),
  });

  return (
    <main className='max-w-6xl mx-auto py-4'>
      <DataTableDemo<property> data={propertyRecords} />
    </main>
  );
}
export default PruebasTable;
