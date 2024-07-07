'use client';

import { Input, Select } from '@/components/ui';
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Key } from 'react';

type FilterField<RecordType> = {
  label: string;
  value: keyof RecordType;
};

type FilterComponentProps<RecordType> = {
  filterFields: FilterField<RecordType>[];
};

export function FilterComponent<RecordType>(
  props: FilterComponentProps<RecordType>
) {
  const { filterFields } = props;

  return (
    <div className='flex w-full max-w-sm items-center p-4'>
      <Input placeholder='Filtrar por Contribuyente' onChange={(e) => {}} />
      <Select
      // onValueChange={(key) => {
      //   setFilterValue({ [key]: undefined } as Partial<RecordType>);
      // }}
      >
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder='Estoy acá' />
        </SelectTrigger>
        <SelectContent>
          {filterFields.map((field) => (
            <SelectItem key={field.value as Key} value={field.value as string}>
              {field.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
