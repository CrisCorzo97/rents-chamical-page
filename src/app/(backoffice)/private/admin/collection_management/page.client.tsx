'use client';

import { Envelope, Pagination } from '@/types/envelope';
import { InvoiceWithRelations } from './collection_management.interface';
import {
  ColumnDef,
  getCoreRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';
import { useCallbackDebouncing, useFPS } from '@/hooks';
import { DataTableColumnHeader } from '@/components/data-table';
import { formatName, formatNumberToCurrency } from '@/lib/formatters';
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
import { Check, Eye, FileText, X } from 'lucide-react';
import Link from 'next/link';
import { stateToSortBy } from '@/lib/table';
import { CustomDataTable } from '@/components/data-table/customDataTable';
import { cn } from '@/lib/cn';
import clsx from 'clsx';
import { Separator } from '@/components/ui/separator';
import dayjs from 'dayjs';
import locale from 'dayjs/locale/es';
import { acceptPayment, rejectPayment } from './actions';

dayjs.locale(locale);

interface CollectionManagementClientProps {
  data: Envelope<InvoiceWithRelations[]>;
  sorting: SortingState;
  filter: string;
}

export const CollectionManagementClient = ({
  data,
  sorting,
  filter,
}: CollectionManagementClientProps) => {
  const [queryFilter, setQueryFilter] = useState<string>(filter);
  const [recordDetails, setRecordDetails] =
    useState<InvoiceWithRelations | null>(null);

  const { handleSort, handlePagination, handleFilter } = useFPS({
    pagination: data.pagination as Pagination,
  });

  const columns: ColumnDef<InvoiceWithRelations>[] = [
    {
      id: 'taxpayer',
      accessorKey: 'taxpayer',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='CONTRIBUYENTE' />
      ),
      enableColumnFilter: true,
      cell: ({ row }) =>
        `${formatName(row.original.user?.first_name ?? '-')} ${formatName(
          row.original.user?.last_name ?? ''
        )}`,
      enableSorting: false,
    },
    {
      id: 'declarable_tax',
      accessorKey: 'declarable_tax',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='TASA' />
      ),
      cell: ({ row }) => {
        let declarable_tax = '';

        if (row.original.affidavit?.length) {
          declarable_tax = row.original.affidavit[0].declarable_tax?.name ?? '';
        } else if (row.original.tax_penalties?.length) {
          declarable_tax =
            row.original.tax_penalties[0].declarable_tax?.name ?? '';
        }

        return formatName(declarable_tax);
      },
      enableSorting: false,
    },
    {
      id: 'due_date',
      accessorKey: 'due_date',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='VENCIMIENTO' />
      ),
      cell: ({ row }) => dayjs(row.original.due_date).format('DD/MM/YYYY'),
      enableSorting: true,
    },
    {
      id: 'payment_date',
      accessorKey: 'payment_date',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='PAGADO EL DÍA' />
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

        return (
          <div className='flex flex-wrap items-center gap-2'>
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
                  <Link
                    target='_blank'
                    href={row.original.attached_receipt ?? '#'}
                  >
                    <Button
                      variant='outline'
                      className='flex items-center gap-2'
                      size='icon'
                    >
                      <Eye size={18} />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent className='bg-black text-white'>
                  <span>Ver comprobante de pago</span>
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
                    onClick={() => rejectPayment(row.original)}
                  >
                    <X size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className='bg-black text-white'>
                  <span>Rechazar pago</span>
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
                    onClick={() => acceptPayment(row.original)}
                  >
                    <Check size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className='bg-black text-white'>
                  <span>Aprobar pago</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
        {/* <div className='flex items-center justify-between py-4'>
          <Input
            placeholder='Filtrar por contribuyente'
            value={queryFilter}
            onChange={(event) => setQueryFilter(event.target.value)}
            className='max-w-sm h-11'
          />

          <Link href='/private/admin/commercial_enablement/create' prefetch>
            <Button className='flex items-center gap-2' size='lg'>
              <Plus size={18} />
              Nuevo registro
            </Button>
          </Link>
        </div> */}
        <CustomDataTable<InvoiceWithRelations>
          tableTitle='Registros de facturas emitidas'
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
                <strong>Comprobante Nro:</strong> {recordDetails.id}
              </CardDescription>
            </CardHeader>

            <Separator className='mb-4 w-[90%] mx-auto' />

            <CardContent className='flex flex-col gap-2'>
              <span className='font-light text-sm'>
                <Label className='font-semibold'>Contribuyente:</Label>{' '}
                {`${formatName(
                  recordDetails.user?.first_name ?? '-'
                )} ${formatName(recordDetails.user?.last_name ?? '')}`}
              </span>
              <span className='font-light text-sm'>
                <Label className='font-semibold'>Tasa:</Label>{' '}
                {recordDetails.affidavit?.length
                  ? formatName(
                      recordDetails.affidavit[0].declarable_tax?.name ?? '-'
                    )
                  : recordDetails.tax_penalties?.length
                  ? formatName(
                      recordDetails.tax_penalties[0].declarable_tax?.name ?? '-'
                    )
                  : '-'}
              </span>
              <span className='font-light text-sm'>
                <Label className='font-semibold'>
                  Declaración/es Jurada/s:
                </Label>{' '}
                {recordDetails.affidavit?.length
                  ? recordDetails.affidavit.map((af) => (
                      <p key={af.id}>
                        {formatName(dayjs(af.period).format('MMMM-YYYY'))}
                      </p>
                    ))
                  : '-'}
              </span>
              <span className='font-light text-sm'>
                <Label className='font-semibold'>Multa/s:</Label>{' '}
                {recordDetails.tax_penalties?.length
                  ? recordDetails.tax_penalties.map((tp) => (
                      <p key={tp.id}>
                        {formatName(dayjs(tp.period).format('MMMM-YYYY'))}
                      </p>
                    ))
                  : '-'}
              </span>
              <span className='font-light text-sm'>
                <Label className='font-semibold'>Importe determinado:</Label>{' '}
                {formatNumberToCurrency(recordDetails.fee_amount ?? 0)}
              </span>
              <span className='font-light text-sm'>
                <Label className='font-semibold'>Intereses acumulados:</Label>{' '}
                {formatNumberToCurrency(
                  recordDetails.compensatory_interest ?? 0
                )}
              </span>
              <span className='font-light text-sm'>
                <Label className='font-semibold'>Total a pagar:</Label>{' '}
                {formatNumberToCurrency(recordDetails.total_amount ?? 0)}
              </span>
              <span className='font-light text-sm'>
                <Label className='font-semibold'>Pagado el día:</Label>{' '}
                {dayjs(recordDetails.payment_date).format('DD/MM/YYYY')}
              </span>
              <span className='font-light text-sm'>
                <Label className='font-semibold'>Comprobante de pago:</Label>{' '}
                <Link
                  target='_blank'
                  href={recordDetails.attached_receipt ?? '#'}
                  className='text-blue-500 underline'
                >
                  {recordDetails.attached_receipt
                    ? recordDetails.attached_receipt
                    : '-'}
                </Link>
              </span>
            </CardContent>
          </>
        )}
      </Card>
    </section>
  );
};
