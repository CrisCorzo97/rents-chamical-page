'use client';

import { DataTableColumnHeader } from '@/components/data-table';
import { CustomDataTable } from '@/components/data-table/customDataTable';
import { Button, Input, Label } from '@/components/ui';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useCallbackDebouncing } from '@/hooks';
import { useFPS } from '@/hooks/useFPS';
import { cn } from '@/lib/cn';
import { formatName } from '@/lib/formatters';
import { stateToSortBy } from '@/lib/table';
import { Envelope, Pagination } from '@/types/envelope';
import {
  ColumnDef,
  getCoreRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import clsx from 'clsx';
import { FileText, Pencil, Plus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { PropertyRecordWithRelations } from './property.interface';

const MISSING_FIELDS: Record<string, string> = {
  enrollment: 'Matrícula',
  address: 'Dirección',
};

interface PropertyPageClientProps {
  data: Envelope<PropertyRecordWithRelations[]>;
  sorting: SortingState;
  filter: string;
}

export function PropertyPageClient({
  data,
  filter,
  sorting,
}: PropertyPageClientProps) {
  const [queryFilter, setQueryFilter] = useState<string>(filter);
  const [recordDetails, setRecordDetails] =
    useState<PropertyRecordWithRelations | null>(null);

  const { handleSort, handlePagination, handleFilter } = useFPS({
    pagination: data.pagination as Pagination,
  });

  const columns: ColumnDef<PropertyRecordWithRelations>[] = [
    {
      id: 'taxpayer',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='CONTRIBUYENTE' />
      ),
      accessorKey: 'taxpayer',
      enableColumnFilter: true,
      cell: ({ row }) => formatName(row.original.taxpayer),
    },
    {
      id: 'enrollment',
      accessorKey: 'enrollment',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='MATRÍCULA' />
      ),
      cell: ({ row }) => row.original.enrollment ?? '-',
      enableSorting: false,
    },
    {
      id: 'address',
      accessorKey: 'address',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='DIRECCIÓN' />
      ),
      cell: ({ row }) => row.original.address ?? '-',
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
    {
      id: 'actions',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='' />
      ),
      cell: ({ row }) => {
        const selectRecord = () => {
          if (recordDetails?.id !== row.original.id) {
            setRecordDetails(row.original);
          } else {
            setRecordDetails(null);
          }
        };

        return (
          <div className='flex items-center gap-2'>
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <Button
                    variant='outline'
                    className='flex items-center gap-2'
                    size='icon'
                    onClick={selectRecord}
                  >
                    <FileText size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className='bg-black text-white'>
                  <span>Ver detalles</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Link
              href={`/private/admin/property/edit/${row.original.id}`}
              prefetch
            >
              <TooltipProvider>
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Button
                      variant='outline'
                      className='flex items-center gap-2'
                      size='icon'
                    >
                      <Pencil size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className='bg-black text-white'>
                    <span>Editar registro</span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Link>
          </div>
        );
      },
      enableSorting: false,
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
    <section className='w-full mb-10 flex flex-wrap gap-3'>
      <div className='w-full flex-1'>
        <div className='flex items-center justify-between py-4'>
          <Input
            placeholder='Filtrar por contribuyente'
            value={queryFilter}
            onChange={(event) => setQueryFilter(event.target.value)}
            className='max-w-sm h-11'
          />

          <Link href='/private/admin/property/create' prefetch>
            <Button className='flex items-center gap-2' size='lg'>
              <Plus size={18} />
              Nuevo registro
            </Button>
          </Link>
        </div>
        <CustomDataTable<PropertyRecordWithRelations>
          tableTitle='Registros de inmuebles'
          columns={columns}
          table={table}
          pagination={data.pagination as Pagination}
          onRecordClick={() => {}}
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
                {recordDetails.taxpayer
                  ? formatName(recordDetails.taxpayer)
                  : '-'}
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
                {recordDetails?.last_year_paid ?? '-'}
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
