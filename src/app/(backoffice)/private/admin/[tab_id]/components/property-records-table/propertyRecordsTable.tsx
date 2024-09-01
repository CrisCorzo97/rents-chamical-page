'use client';

import { Input, Label } from '@/components/ui';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DataTableColumnHeader } from '@/components/ui/data-table';
import { CustomDataTable } from '@/components/ui/data-table/customDataTable';
import { Separator } from '@/components/ui/separator';
import { useCallbackDebouncing } from '@/hooks';
import { useFPS } from '@/hooks/useFPS';
import { cn } from '@/lib/cn';
import { stateToSortBy } from '@/lib/table';
import { Pagination } from '@/types/envelope';
import { city_section, neighborhood, property } from '@prisma/client';
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import clsx from 'clsx';
import { useState } from 'react';
import { PropertyRecordWithRelations } from '../../interfaces/property';
import { ComponentProps } from '../../page';

const MISSING_FIELDS: Record<string, string> = {
  enrollment: 'Matrícula',
  address: 'Dirección',
};

export function PropertyRecordsTable<DataType>({
  data,
  filter,
  sorting,
}: ComponentProps<DataType>) {
  const [queryFilter, setQueryFilter] = useState<string>(filter);
  const [recordDetails, setRecordDetails] =
    useState<PropertyRecordWithRelations | null>(null);

  const { handleSort, handlePagination, handleFilter } = useFPS({
    pagination: data.pagination as Pagination,
  });

  const columns: ColumnDef<DataType>[] = [
    {
      id: 'taxpayer',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='CONTRIBUYENTE' />
      ),
      accessorKey: 'taxpayer',
      enableColumnFilter: true,
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
      id: 'last_year_paid',
      accessorKey: 'last_year_paid',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='ÚLTIMO AÑO DE PAGO' />
      ),
      sortDescFirst: false,
    },
    {
      id: 'missing_fields',
      accessorKey: 'missing_fields',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='CAMPOS FALTANTES' />
      ),
      cell: ({ row }) => {
        let missing_fields: string[] | null = null;
        let value = row.getValue('missing_fields') as string | null;

        if (value) {
          const array = JSON.parse(value) as string[];

          missing_fields = array.map(
            (field: string) => MISSING_FIELDS[field] ?? field
          );
        }

        return missing_fields ? missing_fields.join(', ') : '-';
      },
      enableSorting: true,
    },
  ];

  useCallbackDebouncing({
    value: queryFilter,
    delay: 1200,
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
    <section className='w-full flex flex-wrap gap-3'>
      <div className='w-full flex-1'>
        <div className='flex items-center py-4'>
          <Input
            placeholder='Filtrar por contribuyente'
            value={queryFilter}
            onChange={(event) => setQueryFilter(event.target.value)}
            className='max-w-sm'
          />
        </div>
        <CustomDataTable<DataType>
          tableTitle='Registros de inmuebles'
          columns={columns}
          table={table}
          pagination={data.pagination as Pagination}
          onRecordClick={(record) => {
            if (recordDetails?.id !== (record as property).id) {
              setRecordDetails(
                record as property & {
                  city_section: city_section;
                  neighborhood: neighborhood;
                }
              );
            } else {
              setRecordDetails(null);
            }
          }}
          handlePagination={handlePagination}
        />
      </div>

      <Card
        className={cn(
          `w-full max-w-96 mt-[4.5rem] h-full bg-rose-100 transition-all duration-300`,
          clsx({
            'w-0 border-none': !recordDetails,
          })
        )}
      >
        {recordDetails && (
          <>
            <CardHeader>
              <CardTitle className='text-lg font-semibold'>
                Detalles del registro
              </CardTitle>
              <CardDescription>
                <strong>ID:</strong> {recordDetails.id}
              </CardDescription>
            </CardHeader>

            <Separator className='mb-4 w-[90%] mx-auto' />

            <CardContent className='flex flex-col gap-2'>
              <span className='font-light text-sm'>
                <Label className='font-semibold'>Contribuyente:</Label>{' '}
                {recordDetails.taxpayer ?? '-'}
              </span>
              <span className='font-light text-sm'>
                <Label className='font-semibold'>Tipo de contribuyente:</Label>{' '}
                {recordDetails.taxpayer_type ?? '-'}
              </span>
              <span className='font-light text-sm'>
                <Label className='font-semibold'>Matrícula:</Label>{' '}
                {recordDetails.enrollment ?? '-'}
              </span>
              <span className='font-light text-sm'>
                <Label className='font-semibold'>Es parte:</Label>{' '}
                {recordDetails.is_part ? 'Si' : 'No'}
              </span>
              <span className='font-light text-sm'>
                <Label className='font-semibold'>Dirección:</Label>{' '}
                {recordDetails.address ?? '-'}
              </span>
              <span className='font-light text-sm'>
                <Label className='font-semibold'>Barrio:</Label>{' '}
                {recordDetails.neighborhood?.name ?? '-'}
              </span>
              <span className='font-light text-sm'>
                <Label className='font-semibold'>Sección:</Label>{' '}
                {recordDetails.city_section?.name ?? '-'}
              </span>
              <span className='font-light text-sm'>
                <Label className='font-semibold'>Último año abonado:</Label>{' '}
                {`${recordDetails.last_year_paid}` ?? '-'}
              </span>
              <span className='font-light text-sm'>
                <Label className='font-semibold'>Campos faltantes:</Label>{' '}
                {recordDetails.missing_fields
                  ? JSON.parse(recordDetails.missing_fields)
                      .map((field: string) => MISSING_FIELDS[field] ?? field)
                      .join(', ')
                  : '-'}
              </span>
            </CardContent>
          </>
        )}
      </Card>
    </section>
  );
}
