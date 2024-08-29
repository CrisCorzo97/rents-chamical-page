'use client';

import { Input } from '@/components/ui';
import { DataTableColumnHeader } from '@/components/ui/data-table';
import { CustomDataTable } from '@/components/ui/data-table/customDataTable';
import { useCallbackDebouncing } from '@/hooks';
import { useFPS } from '@/hooks/useFPS';
import { stateToSortBy } from '@/lib/table';
import { Envelope, Pagination } from '@/types/envelope';
import { cementery } from '@prisma/client';
import {
  ColumnDef,
  SortingState,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';

export const columns: ColumnDef<cementery>[] = [
  {
    id: 'id',
    header: 'ID',
    accessorKey: 'id',
  },
  {
    id: 'taxpayer',
    header: 'CONTRIBUYENTE',
    accessorKey: 'taxpayer',
    enableColumnFilter: true,
  },
  {
    id: 'address',
    accessorKey: 'address',
    header: 'DIRECCIÓN',
  },
  {
    id: 'section',
    accessorKey: 'section',
    header: 'SECCIÓN',
    // cell: ({ row }) => {
    //   const enrollment = row.getValue('enrollment');

    //   return enrollment ? `${enrollment}` : '-';
    // },
  },
  {
    id: 'location_number',
    accessorKey: 'location_number',
    header: 'NRO LOCALIZACIÓN',
    // cell: ({ row }) => {
    //   const is_part = row.getValue('is_part');

    //   return is_part ? 'Sí' : 'No';
    // },
  },
  {
    id: 'last_year_paid',
    accessorKey: 'last_year_paid',
    header: 'ÚLTIMO PAGO',
  },
];

interface CementeryRecordsTableProps<T> {
  data: Envelope<T[]>;
  sorting: SortingState;
  filter: string;
}

export function CementeryRecordsTable<DataType>(
  props: CementeryRecordsTableProps<DataType>
) {
  const { data, sorting, filter } = props;

  const [queryFilter, setQueryFilter] = React.useState<string>(filter);

  const { handleSort, handlePagination, handleFilter } = useFPS({
    pagination: data.pagination as Pagination,
  });

  const columns: ColumnDef<DataType>[] = [
    {
      id: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='ID' />
      ),
      accessorKey: 'id',
      enableSorting: false,
    },
    {
      id: 'taxpayer',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='CONTRIBUYENTE' />
      ),
      accessorKey: 'taxpayer',
      enableColumnFilter: true,
    },
    {
      id: 'address',
      accessorKey: 'address',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='DIRECCIÓN' />
      ),
      cell: ({ row }) => {
        const address = row.getValue('address');

        return address ? `${address}` : '-';
      },
      enableSorting: false,
    },
    {
      id: 'enrollment',
      accessorKey: 'enrollment',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='MATRÍCULA' />
      ),
      cell: ({ row }) => {
        const enrollment = row.getValue('enrollment');

        return enrollment ? `${enrollment}` : '-';
      },
      enableSorting: false,
    },
    {
      id: 'is_part',
      accessorKey: 'is_part',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='ES PARTE' />
      ),
      cell: ({ row }) => {
        const is_part = row.getValue('is_part');

        return is_part ? 'Sí' : 'No';
      },
      enableSorting: false,
    },
    {
      id: 'last_year_paid',
      accessorKey: 'last_year_paid',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='ÚLTIMO AÑO PAGO' />
      ),
    },
  ];

  useCallbackDebouncing({
    value: queryFilter,
    delay: 1500,
    callback: () => {
      if (queryFilter !== filter) {
        handleFilter({
          filter: queryFilter,
        });
      }
    },
  });

  const table = useReactTable({
    data: data.data ?? [],
    columns,
    manualSorting: true,
    manualPagination: true,
    manualFiltering: true,
    onSortingChange: (updaterOrValue) => {
      const newSortingState =
        typeof updaterOrValue === 'function'
          ? updaterOrValue(sorting)
          : updaterOrValue;

      handleSort(stateToSortBy(newSortingState) ?? {});
    },
    getCoreRowModel: getCoreRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className='w-full'>
      <div className='flex items-center py-4'>
        <Input
          placeholder='Filtrar por contribuyente'
          value={queryFilter}
          onChange={(event) => setQueryFilter(event.target.value)}
          className='max-w-sm'
        />
      </div>
      <CustomDataTable<DataType>
        tableTitle='Registros de cementerio'
        columns={columns}
        table={table}
        pagination={data.pagination as Pagination}
        handlePagination={handlePagination}
      />
    </div>
  );
}
