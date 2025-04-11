'use client';

import { DataTableColumnHeader } from '@/components/data-table';
import { CustomDataTable } from '@/components/data-table/customDataTable';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Label,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui';
import { Separator } from '@/components/ui/separator';
import { useFPS } from '@/hooks';
import { cn } from '@/lib/cn';
import { formatNumberToCurrency } from '@/lib/formatters';
import { stateToSortBy } from '@/lib/table';
import { Envelope, Pagination } from '@/types/envelope';
import {
  ColumnDef,
  getCoreRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { FileDown, FileText } from 'lucide-react';
import { useState } from 'react';
import { InvoiceWithRelations } from '../types';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useRouter } from 'next/navigation';
dayjs.extend(customParseFormat);

interface PaymentHistoryTableProps {
  data: Envelope<InvoiceWithRelations[]>;
  sorting: SortingState;
}

export function PaymentHistoryClient({
  data,
  sorting,
}: PaymentHistoryTableProps) {
  const [recordDetails, setRecordDetails] =
    useState<InvoiceWithRelations | null>(null);
  const router = useRouter();

  const { handleSort, handlePagination } = useFPS({
    pagination: data.pagination as Pagination,
  });

  const columns: ColumnDef<InvoiceWithRelations>[] = [
    {
      id: 'id',
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='NRO COMPROBANTE' />
      ),
      enableSorting: false,
    },
    {
      id: 'total_amount',
      accessorKey: 'total_amount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='IMPORTE ABONADO' />
      ),
      cell: ({ row }) => formatNumberToCurrency(row.original.total_amount),
      enableSorting: true,
    },
    {
      id: 'due_date',
      accessorKey: 'due_date',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='FECHA DE VENCIMIENTO' />
      ),
      cell: ({ row }) => dayjs(row.original.due_date).format('DD/MM/YYYY'),
      enableSorting: true,
    },
    {
      id: 'payment_date',
      accessorKey: 'payment_date',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='FECHA DE PAGO' />
      ),
      cell: ({ row }) => dayjs(row.original.payment_date).format('DD/MM/YYYY'),
      enableSorting: true,
    },
    {
      id: 'actions',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='ACCIONES' />
      ),
      cell: ({ row }) => {
        const selectRecord = () => {
          if (recordDetails?.id !== row.original.id) {
            setRecordDetails(row.original);
          } else {
            setRecordDetails(null);
          }
        };

        const handleViewInvoice = () => {
          router.push(
            `/tramites/DDJJ-actividad-comercial/historial-pagos/${row.original.id}`
          );
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
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <Button
                    variant='outline'
                    className='flex items-center gap-2'
                    size='icon'
                    onClick={handleViewInvoice}
                  >
                    <FileDown size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className='bg-black text-white'>
                  <span>Descargar factura</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
      enableSorting: false,
    },
  ];

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
        <CustomDataTable<InvoiceWithRelations>
          tableTitle='Registros de cementerio'
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
                <Label className='font-semibold'>Fecha de emisión:</Label>{' '}
                {dayjs(recordDetails.payment_date).format('DD/MM/YYYY')}
              </span>
              <span className='font-light text-sm'>
                <Label className='font-semibold'>Fecha de vencimiento:</Label>{' '}
                {dayjs(recordDetails.due_date).format('DD/MM/YYYY')}
              </span>
              <span className='font-light text-sm'>
                <Label className='font-semibold'>Importe calculado:</Label>{' '}
                {formatNumberToCurrency(recordDetails.fee_amount)}
              </span>
              <span className='font-light text-sm'>
                <Label className='font-semibold'>
                  Intereses compensatorios:
                </Label>{' '}
                {formatNumberToCurrency(
                  recordDetails.compensatory_interest ?? 0
                )}
              </span>
              <span className='font-light text-sm'>
                <Label className='font-semibold'>Total pagado:</Label>{' '}
                {formatNumberToCurrency(recordDetails.total_amount)}
              </span>
              <span className='font-light text-sm'>
                <Label className='font-semibold'>Fecha de pago:</Label>{' '}
                {dayjs(recordDetails.payment_date).format('DD/MM/YYYY')}
              </span>
              <span className='font-light text-sm'>
                <Label className='font-semibold'>Período/s:</Label>{' '}
                {recordDetails.affidavit
                  ?.map((affidavit) =>
                    dayjs(affidavit.period).format('MM/YYYY')
                  )
                  .join(' - ') ?? '-'}
              </span>
            </CardContent>
          </>
        )}
      </Card>
    </section>
  );
}
