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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { useCallbackDebouncing } from '@/hooks';
import { useFPS } from '@/hooks/useFPS';
import { cn } from '@/lib/cn';
import { stateToSortBy } from '@/lib/table';
import { Envelope, Pagination } from '@/types/envelope';
import { receipt } from '@prisma/client';
import {
  ColumnDef,
  getCoreRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { CirclePlus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { ConfirmModal } from './components';

interface ReceiptClientPageProps {
  data: Envelope<receipt[]>;
  sorting: SortingState;
  filter: string;
}

export const ReceiptClientPage = ({
  data,
  filter,
  sorting,
}: ReceiptClientPageProps) => {
  const [queryFilter, setQueryFilter] = useState<string>(filter);
  const [recordDetails, setRecordDetails] = useState<receipt | null>(null);

  const { handleSort, handlePagination, handleFilter } = useFPS({
    pagination: data.pagination as Pagination,
  });

  const columns: ColumnDef<receipt>[] = [
    {
      id: 'taxpayer',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='CONTRIBUYENTE' />
      ),
      accessorKey: 'taxpayer',
      enableSorting: true,
    },
    {
      id: 'amount',
      accessorKey: 'amount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='IMPORTE' />
      ),
      cell: ({ row }) => {
        const amount = row.getValue('amount') as number;

        return amount.toLocaleString('es-AR', {
          style: 'currency',
          currency: 'ARS',
          maximumFractionDigits: 2,
        });
      },
      enableSorting: false,
    },
    {
      id: 'tax_type',
      accessorKey: 'tax_type',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='TASA / CONTIBUCIÓN' />
      ),
    },
    {
      id: 'created_at',
      accessorKey: 'created_at',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='FECHA CREACIÓN' />
      ),
      cell: ({ row }) => {
        const created_at = row.getValue('created_at') as number;

        return dayjs(created_at).format('DD/MM/YYYY HH:mm');
      },
      enableSorting: true,
    },
    {
      id: 'confirmed_at',
      accessorKey: 'confirmed_at',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='FECHA CONFIRMACIÓN' />
      ),
      cell: ({ row }) => {
        const confirmed_at = row.getValue('confirmed_at') as number;

        return dayjs(confirmed_at).format('DD/MM/YYYY HH:mm');
      },
      enableSorting: true,
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
    <section className='w-full mb-10 flex flex-wrap gap-3'>
      <div className='w-full flex-1'>
        <Card className='mt-6 flex flex-col items-center justify-center border-dashed bg-neutral-100'>
          <CardHeader>
            <CardTitle className='text-lg font-semibold'>
              Acciones rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className='flex gap-2 mt-4'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size='lg' className='flex gap-2'>
                  <CirclePlus size={18} />
                  Crear
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-full'>
                <DropdownMenuItem>
                  <Link
                    href='/private/admin/receipts/create-various-rates-receipt'
                    prefetch
                    className='w-full'
                  >
                    Tasas diversas
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href='/private/admin/receipts/create-cementery-receipt'
                    prefetch
                    className='w-full'
                  >
                    Cementerio
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href='/private/admin/receipts/create-property-receipt'
                    prefetch
                    className='w-full'
                  >
                    Inmueble
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href='/private/admin/receipts/create-patent-receipt'
                    prefetch
                    className='w-full'
                  >
                    Patente
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <ConfirmModal />
          </CardContent>
        </Card>

        <div className='flex items-center justify-between mb-4 mt-6'>
          <Input
            placeholder='Filtrar por contribuyente'
            value={queryFilter}
            onChange={(event) => setQueryFilter(event.target.value)}
            className='max-w-sm'
          />
        </div>
        <CustomDataTable<receipt>
          tableTitle='Historial de comprobantes'
          columns={columns}
          table={table}
          pagination={data.pagination as Pagination}
          handlePagination={handlePagination}
          onRecordClick={(record) => {
            if (recordDetails?.id !== record.id) {
              setRecordDetails(record);
            } else {
              setRecordDetails(null);
            }
          }}
        />
      </div>

      <Card
        className={cn(
          `w-full max-w-96 mt-[4.5rem] bg-rose-100 transition-all duration-300`,
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
                {recordDetails.taxpayer}
              </span>
              <span className='font-light text-sm'>
                <Label className='font-semibold'>Importe:</Label>{' '}
                {recordDetails.amount.toLocaleString('es-AR', {
                  style: 'currency',
                  currency: 'ARS',
                  maximumFractionDigits: 2,
                })}
              </span>
              <span className='font-light text-sm'>
                <Label className='font-semibold'>Tasa / Contribución:</Label>{' '}
                {recordDetails.tax_type}
              </span>
              <span className='font-light text-sm'>
                <Label className='font-semibold'>ID de referencia:</Label>{' '}
                {recordDetails.id_tax_reference}
              </span>
              <span className='font-light text-sm'>
                <Label className='font-semibold'>Fecha de creación:</Label>{' '}
                {dayjs(recordDetails.created_at).format('DD/MM/YYYY HH:mm')}
              </span>
              <span className='font-light text-sm'>
                <Label className='font-semibold'>Fecha de confirmación:</Label>{' '}
                {dayjs(recordDetails.confirmed_at).format('DD/MM/YYYY HH:mm')}
              </span>
            </CardContent>
          </>
        )}
      </Card>
    </section>
  );
};
