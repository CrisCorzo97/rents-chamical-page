'use client';

import {
  ColumnDef,
  getCoreRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { AffidavitsWithRelations } from './affidavits.interface';
import { useState } from 'react';
import { useFPS } from '@/hooks';
import { Envelope, Pagination } from '@/types/envelope';
import { DataTableColumnHeader } from '@/components/data-table';
import { formatName, formatNumberToCurrency } from '@/lib/formatters';
import dayjs from 'dayjs';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { affidavit_status } from '@prisma/client';
import locale from 'dayjs/locale/es';
import { stateToSortBy } from '@/lib/table';
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
import { FileText, X } from 'lucide-react';
import { CustomDataTable } from '@/components/data-table/customDataTable';
import { cn } from '@/lib/cn';
import clsx from 'clsx';
import { Separator } from '@radix-ui/react-select';
dayjs.locale(locale);

const STATUS_DICTIONARY: Record<affidavit_status, string> = {
  pending_payment: 'Pendiente de pago',
  under_review: 'En revisión',
  approved: 'Aprobado',
  refused: 'Rechazado',
  defeated: 'Vencido',
};

const STATUS_OPTIONS: {
  value: affidavit_status | 'all';
  label: string;
}[] = [
  { value: 'pending_payment', label: 'Pendiente de pago' },
  { value: 'under_review', label: 'En revisión' },
  { value: 'approved', label: 'Aprobado' },
  { value: 'refused', label: 'Rechazado' },
];

interface AffidavitClientProps {
  data: Envelope<AffidavitsWithRelations[]>;
  sorting: SortingState;
  filter: string;
}

export const AffidavitsClient = ({
  data,
  sorting,
  filter,
}: AffidavitClientProps) => {
  const [recordDetails, setRecordDetails] =
    useState<AffidavitsWithRelations | null>(null);

  const { handleSort, handlePagination, handleFilter } = useFPS({
    pagination: data.pagination as Pagination,
  });

  const columns: ColumnDef<AffidavitsWithRelations>[] = [
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
      id: 'tax_id',
      accessorKey: 'tax_id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='CUIT' />
      ),
      enableColumnFilter: true,
      cell: ({ row }) => row.original.tax_id,
      enableSorting: false,
    },
    {
      id: 'period',
      accessorKey: 'period',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='PERÍODO' />
      ),
      enableColumnFilter: true,
      cell: ({ row }) => dayjs(row.original.period).format('MM/YYYY'),
      enableSorting: true,
    },
    {
      id: 'declarable_tax',
      accessorKey: 'declarable_tax',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='TASA' />
      ),
      cell: ({ row }) => formatName(row.original.declarable_tax?.name ?? '-'),
      enableSorting: false,
    },
    {
      id: 'fee_amount',
      accessorKey: 'fee_amount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='IMPORTE DETERMINADA' />
      ),
      cell: ({ row }) => formatNumberToCurrency(row.original.fee_amount),
      enableSorting: true,
    },
    {
      id: 'due_date',
      accessorKey: 'due_date',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='VENCIMIENTO' />
      ),
      cell: ({ row }) =>
        dayjs(row.original.payment_due_date).format('DD/MM/YYYY'),
      enableSorting: true,
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='ESTADO' />
      ),
      cell: ({ row }) => {
        let variant: BadgeProps['variant'] = 'default';

        switch (row.original.status) {
          case 'approved':
            variant = 'success';
            break;
          case 'refused':
            variant = 'error';
            break;
          case 'under_review':
            variant = 'warning';
            break;
          case 'pending_payment':
            variant = 'info';
            break;
          default:
            variant = 'default';
            break;
        }

        return (
          <Badge variant={variant}>
            {STATUS_DICTIONARY[row.original.status]}
          </Badge>
        );
      },
      enableSorting: false,
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
          console.log({ data: row.original, recordDetails });
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
        {/* <div className='w-full max-w-md py-4 flex items-center gap-1'>
          <Select
            value={filter}
            onValueChange={(val) =>
              handleFilter({
                filter: val,
              })
            }
          >
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Filtrar por estado' />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant='outline'
            size='icon'
            onClick={() => handleFilter({ filter: '' })}
            disabled={!filter}
          >
            <FilterX size={18} />
          </Button>
        </div> */}
        <CustomDataTable<AffidavitsWithRelations>
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
            <CardHeader className='relative'>
              <X
                size={20}
                className='absolute top-3 right-3 cursor-pointer text-gray-800'
                onClick={() => setRecordDetails(null)}
              />

              <CardTitle className='text-lg underline font-semibold'>
                Detalles del registro
              </CardTitle>
              <CardDescription className='text-gray-800 font-semibold text-base'>
                <strong>ID:</strong> {recordDetails.id}
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
                <Label className='font-semibold'>CUIT:</Label>{' '}
                {recordDetails.tax_id}
              </span>
              <span className='font-light text-sm'>
                <Label className='font-semibold'>Período:</Label>{' '}
                {dayjs(recordDetails.period).format('MM/YYYY')}
              </span>
              <span className='font-light text-sm'>
                <Label className='font-semibold'>Tasa:</Label>{' '}
                {formatName(recordDetails.declarable_tax?.name ?? '-')}
              </span>
              <span className='font-light text-sm'>
                <Label className='font-semibold'>Importe declarado:</Label>{' '}
                {formatNumberToCurrency(recordDetails.declared_amount ?? 0)}
              </span>
              <span className='font-light text-sm'>
                <Label className='font-semibold'>Importe determinado:</Label>{' '}
                {formatNumberToCurrency(recordDetails.fee_amount ?? 0)}
              </span>
              <span className='font-light text-sm'>
                <Label className='font-semibold'>Fecha de vencimiento:</Label>{' '}
                {dayjs(recordDetails.payment_due_date).format('DD/MM/YYYY')}
              </span>
              <span className='font-light text-sm'>
                <Label className='font-semibold'>Aprobado el día:</Label>{' '}
                {recordDetails.approved_at
                  ? dayjs(recordDetails.approved_at).format('DD/MM/YYYY HH:mm')
                  : '-'}
              </span>
              <span className='font-light text-sm'>
                <Label className='font-semibold'>
                  Nro comprobante asociado:
                </Label>{' '}
                {recordDetails.invoice?.id ?? '-'}
              </span>
              <span className='font-light text-sm'>
                <Label className='font-semibold'>Fecha de creación:</Label>{' '}
                {dayjs(recordDetails.created_at).format('DD/MM/YYYY HH:mm')}
              </span>
            </CardContent>
          </>
        )}
      </Card>
    </section>
  );
};
