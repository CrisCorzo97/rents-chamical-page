import { FilterField } from '../pruebas-ui/page.client';
import { FilterComponent } from './page.client';
import { property } from '@prisma/client';

function FilterPage() {
  const filterFields: FilterField<property>[] = [
    {
      label: 'Contribuyente',
      value: 'taxpayer',
    },
    {
      label: 'Dirección',
      value: 'address',
    },
    {
      label: 'ID',
      value: 'id',
    },
  ];

  return (
    <div className='max-w-6xl mx-auto py-4'>
      <FilterComponent<property> filterFields={filterFields} key='property' />
    </div>
  );
}
export default FilterPage;
