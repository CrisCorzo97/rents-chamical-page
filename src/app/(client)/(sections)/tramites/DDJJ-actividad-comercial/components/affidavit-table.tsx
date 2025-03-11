'use client';

import { DataTableColumnHeader } from '@/components/data-table';
import { CustomDataTable } from '@/components/data-table/customDataTable';
import { Badge, Button } from '@/components/ui';
import { useFPS } from '@/hooks';
import { formatName, formatNumberToCurrency } from '@/lib/formatters';
import { stateToSortBy } from '@/lib/table';
import { Envelope, Pagination } from '@/types/envelope';
import {
  ColumnDef,
  getCoreRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import dayjs from 'dayjs';
import { Upload } from 'lucide-react';
import { AffidavitWithRelations } from '../types';

interface AffidavitTableProps {
  data: Envelope<AffidavitWithRelations[]>;
  sorting: SortingState;
}

export default function AffidavitTable({ data, sorting }: AffidavitTableProps) {
  const { handleSort, handlePagination } = useFPS({
    pagination: data.pagination as Pagination,
  });

  const columns: ColumnDef<AffidavitWithRelations>[] = [
    {
      id: 'period',
      accessorKey: 'period',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='PERÍODO' />
      ),
      cell: ({ row }) =>
        `${formatName(dayjs(row.original.period).format('MMMM'))} ${dayjs(
          row.original.period
        ).format('YYYY')}`,
      enableSorting: false,
    },
    {
      id: 'due_date',
      accessorKey: 'due_date',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title='VENCIMIENTO PARA EL PAGO'
        />
      ),
      cell: ({ row }) =>
        dayjs(row.original.payment_due_date).format('DD/MM/YYYY'),
      enableSorting: false,
    },
    {
      id: 'declared_amount',
      accessorKey: 'declared_amount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='IMPORTE DECLARADO' />
      ),
      cell: ({ row }) => formatNumberToCurrency(row.original.declared_amount),
      enableSorting: false,
    },
    {
      id: 'fee_amount',
      accessorKey: 'fee_amount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='IMPORTE A PAGAR' />
      ),
      cell: ({ row }) => formatNumberToCurrency(row.original.fee_amount),
      enableSorting: false,
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='ESTADO' />
      ),
      cell: ({ row }) => {
        const status = row.original.status;

        switch (status) {
          case 'pending_payment':
            return <Badge variant='warning'>Pendiente de pago</Badge>;
          case 'under_review':
            return <Badge variant='info'>En revisión</Badge>;
          case 'approved':
            return <Badge variant='success'>Aprobado</Badge>;
          case 'refused':
            return <Badge variant='error'>Rechazado</Badge>;
          default:
            return <></>;
        }
      },
      enableSorting: false,
    },
    {
      id: 'actions',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='ACCIONES' />
      ),
      cell: ({ row }) => {
        const existInvoice = row.original.invoice_id !== null;

        if (row.original.status === 'pending_payment' && existInvoice) {
          return (
            <Button
              variant='outline'
              className='flex items-center gap-2'
              size='icon'
              onClick={() => {}}
            >
              <Upload />
              Subir comprobante
            </Button>
          );
        } else {
          return <></>;
        }
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
    <CustomDataTable<AffidavitWithRelations>
      tableTitle='Declaraciones Presentadas'
      columns={columns}
      table={table}
      pagination={data.pagination as Pagination}
      onRecordClick={() => {}}
      handlePagination={handlePagination}
    />
  );
}
