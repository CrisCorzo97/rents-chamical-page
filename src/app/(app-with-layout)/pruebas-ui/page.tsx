import { property } from '@prisma/client';
import { getProperties } from '../private/dashboard/actions';
import PruebasUiClient from './page.client';

type Column<T> = {
  title: string;
  dataIndex: keyof T;
  render?: (value: T[keyof T], record: T) => JSX.Element;
};

async function PruebasUi({
  searchParams,
}: {
  searchParams: {
    filter: string;
    orderBy: string;
    limit: string;
    page: string;
  };
}) {
  const { filter, orderBy, limit, page } = searchParams;

  const propertyRecords = await getProperties({});

  const { data, error, pagination } = propertyRecords;

  const columns: Column<property>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'CONTRIBUYENTE',
      dataIndex: 'taxpayer',
    },
    {
      title: 'Dirección',
      dataIndex: 'address',
    },
    {
      title: 'Último Pago',
      dataIndex: 'last_year_paid',
    },
    {
      title: 'Fecha de Creación',
      dataIndex: 'created_at',
    },
    {
      title: 'Última modificación',
      dataIndex: 'updated_at',
    },
  ];

  return (
    <main className='max-w-6xl mx-auto py-4'>
      <PruebasUiClient<property>
        dataSource={!!data ? data : []}
        columns={columns}
        rowKey='id'
        error={error}
        pagination={!!pagination ? pagination : undefined}
      />
    </main>
  );
}
export default PruebasUi;
