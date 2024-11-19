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
import { receipt } from '@prisma/client';
import {
  ColumnDef,
  getCoreRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { FileText } from 'lucide-react';
import { useState } from 'react';

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
      cell: ({ row }) => formatName(row.original.taxpayer),
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
        );
      },
      enableSorting: false,
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
          onRecordClick={() => {}}
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
                {recordDetails.taxpayer
                  ? formatName(recordDetails.taxpayer)
                  : '-'}
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
