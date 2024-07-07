'use client';
import { Input, Select, Table } from '@/components/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useFilter } from '@/hooks/table';
import { Pagination } from '@/types/envelope';
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@radix-ui/react-select';
import React, { Key, useCallback, useMemo, useState } from 'react';

type Column<T> = {
  title: string;
  dataIndex: keyof T;
  render?: (value: T[keyof T], record: T) => JSX.Element;
};

export type FilterField<T> = {
  label: string;
  value: keyof T;
};

type PruebasUiClientProps<RecordType> = {
  title?: string;
  dataSource: RecordType[];
  rowKey: keyof RecordType;
  columns: Column<RecordType>[];
  filterTableKey?: string;
  filterFields?: Array<FilterField<RecordType>>;
  pagination?: Pagination;
  error?: string;
};

function PruebasUiClient<RecordType extends object>(
  props: PruebasUiClientProps<RecordType>
) {
  const {
    title,
    dataSource,
    rowKey,
    columns,
    filterTableKey,
    filterFields,
    pagination,
    error,
  } = props;

  const [filterValue, setFilterValue] = useState<
    Partial<RecordType> | undefined
  >(
    filterFields
      ? ({ [filterFields[0].value]: undefined } as Partial<RecordType>)
      : undefined
  );

  const { updateFilter } = useFilter<RecordType>(filterTableKey ?? '*');

  // const handleFilter = useCallback(() => {
  //   updateFilter(filterValue);
  // }, [filterValue, updateFilter]);

  console.log({ filterValue });

  const Filter = useMemo(() => {
    let Component = () => <></>;

    if (filterFields) {
      const FilterComponent = () => (
        <div className='flex w-full max-w-sm items-center p-4'>
          <Input placeholder='Filtrar por Contribuyente' onChange={(e) => {}} />
          <Select
            onValueChange={(key) => {
              setFilterValue({ [key]: undefined } as Partial<RecordType>);
            }}
          >
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Estoy acá' />
            </SelectTrigger>
            <SelectContent>
              {filterFields.map((field) => (
                <SelectItem
                  key={field.value as Key}
                  value={field.value as string}
                >
                  {field.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
      FilterComponent.displayName = 'FilterComponent';

      Component = FilterComponent;
    }

    return Component;
  }, [filterFields, filterValue]);

  const Title = useMemo(() => {
    let Component = () => <></>;

    if (title) {
      const TitleComponent = () => (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      );
      TitleComponent.displayName = 'TitleComponent';

      Component = TitleComponent;
    }

    return Component;
  }, [title]);

  const CustomTableHeader = useMemo(() => {
    const TableHeaderComponent = () => (
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.title}>{column.title}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
    );
    TableHeaderComponent.displayName = 'TableHeaderComponent';

    return TableHeaderComponent;
  }, [columns]);

  const tableCellContent = useCallback(
    (record: RecordType, column: Column<RecordType>) => {
      if (column.render) {
        return column.render(record[column.dataIndex], record);
      }

      if (
        typeof record[column.dataIndex] === 'object' &&
        record[column.dataIndex] !== null
      ) {
        // Assuming you want to render object as JSON string
        return JSON.stringify(record[column.dataIndex]);
      }

      return record[column.dataIndex] as React.ReactNode;
    },
    []
  );

  const CustomTableBody = useMemo(() => {
    const TableBodyComponent = () => (
      <TableBody>
        {dataSource.map((record) => (
          <TableRow key={record[rowKey] as Key}>
            {columns.map((column) => (
              <TableCell key={column.title}>
                {tableCellContent(record, column)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    );
    TableBodyComponent.displayName = 'TableBodyComponent';

    return TableBodyComponent;
  }, [dataSource, columns, rowKey, tableCellContent]);

  return (
    <Card className='w-full flex flex-col'>
      <Filter />
      <Title />
      <CardContent>
        <Table>
          <CustomTableHeader />
          <CustomTableBody />
        </Table>
      </CardContent>
    </Card>
  );
}
export default PruebasUiClient;
