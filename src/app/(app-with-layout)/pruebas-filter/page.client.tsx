'use client';

import { Input, Select } from '@/components/ui';
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCallbackDebouncing, useQueryParams } from '@/hooks';
import { Key, useEffect, useState } from 'react';

type FieldToFilter<RecordType> = {
  label: string;
  value: keyof RecordType;
};

type FiltersState<RecordType> = Record<keyof RecordType, string>;

type FilterComponentProps<RecordType> = {
  filterFields: FieldToFilter<RecordType>[];
  currentFilter?: FiltersState<RecordType>;
  prefix?: string;
};

export function FilterComponent<RecordType>(
  props: FilterComponentProps<RecordType>
) {
  const { filterFields, currentFilter, prefix } = props;

  const [filters, setFilters] = useState<FiltersState<RecordType>>(
    currentFilter ? currentFilter : ({} as FiltersState<RecordType>)
  );
  const [inputValue, setInputValue] = useState<string>('');
  const [selectValue, setSelectValue] = useState<keyof RecordType>(
    filterFields?.[0]?.value as keyof RecordType
  );

  useEffect(() => {
    if (currentFilter) {
      let currentFilterValues: Record<'key' | 'value', string> | null = null;

      for (const key in currentFilter) {
        if (currentFilter[key as keyof RecordType]) {
          currentFilterValues = {
            key,
            value: currentFilter[key as keyof RecordType],
          };
          break;
        }
      }

      setFilters(currentFilter);
      setInputValue(currentFilterValues ? currentFilterValues.value : '');
      setSelectValue(
        currentFilterValues
          ? (currentFilterValues.key as keyof RecordType)
          : (filterFields?.[0]?.value as keyof RecordType)
      );
    }
  }, [currentFilter, filterFields]);

  const { updateURLQuery } = useQueryParams();

  useCallbackDebouncing({
    value: inputValue,
    delay: 1000,
    callback: () => {
      const prevFilters = { ...filters };
      prevFilters[selectValue as keyof RecordType] = inputValue;

      for (const key in prevFilters) {
        if (key !== selectValue) {
          prevFilters[key] = '';
        }
      }

      setFilters(prevFilters);
    },
  });

  useEffect(() => {
    updateURLQuery(filters);
  }, [updateURLQuery, filters]);

  return (
    <div className='flex w-full max-w-sm items-center p-4'>
      <Input
        placeholder={`Filtrar por...`}
        onChange={(e) => setInputValue(e.target.value)}
        value={inputValue}
      />
      <Select
        onValueChange={(key) => {
          setInputValue('');
          setSelectValue(key as keyof RecordType);
        }}
        value={selectValue as string}
      >
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder='Seleccionar' />
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
