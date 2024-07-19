import { ColumnDef } from '@tanstack/react-table';
import { getProperties } from '../private/dashboard/actions';
import { DataTableDemo } from './page.client';
import { property } from '@prisma/client';

export type CustomColumnDef<T> = ColumnDef<T> & {
  cellFormatter?: (value: any) => any;
};

async function PruebasTable() {
  const propertyRecords = await getProperties({});

  return (
    <main className='max-w-6xl mx-auto py-4'>
      <DataTableDemo<property> data={propertyRecords} />
    </main>
  );
}
export default PruebasTable;
