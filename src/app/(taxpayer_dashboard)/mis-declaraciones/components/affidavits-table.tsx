'use client';

import { ColumnDef } from '@tanstack/react-table';
import { AffidavitWithRelations } from '../types/affidavits.types';
import { formatName, formatNumberToCurrency } from '@/lib/formatters';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { affidavit_status } from '@prisma/client';
import locale from 'dayjs/locale/es';
import { FileText } from 'lucide-react';
import { DataTable, DataTableColumnHeader } from '@/components/custom-table';
import { Envelope } from '@/types/envelope';
import { useDataTableURLParams } from '@/hooks/useDataTableURLParams';
import { FilterableColumn } from '@/components/custom-table/data-table-toolbar';
import { ActionButtons } from '@/components/custom-table/action-buttons';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { use, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Toaster } from '@/components/ui/toaster';
import { TableSkeleton } from '@/components/custom-table/table-skeleton';
dayjs.locale(locale);
dayjs.extend(utc);

const STATUS_DICTIONARY: Record<affidavit_status, string> = {
  pending_payment: 'Pendiente de pago',
  under_review: 'En revisión',
  approved: 'Aprobado',
  refused: 'Rechazado',
  defeated: 'Vencido',
};

const STATUS_OPTIONS = [
  { value: 'pending_payment', label: 'Pendiente de pago' },
  { value: 'under_review', label: 'En revisión' },
  { value: 'approved', label: 'Aprobado' },
  { value: 'refused', label: 'Rechazado' },
];

export const AffidavitsTableSkeleton = () => {
  return <TableSkeleton title='Declaraciones Juradas' columns={6} rows={8} />;
};

export function AffidavitsTable({
  data,
}: {
  data: Promise<Envelope<AffidavitWithRelations[]>>;
}) {
  const { data: items, pagination } = use(data);

  const [selectedAffidavit, setSelectedAffidavit] =
    useState<AffidavitWithRelations | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    currentPage,
    currentLimit,
    currentSortBy,
    currentSortDirection,
    activeFilters,
    handlePageChange,
    handleLimitChange,
    handleFilterChange,
    handleSortingChange,
  } = useDataTableURLParams({ defaultLimit: pagination?.limit ?? 8 });

  const renderAffidavitDetails = (affidavit: AffidavitWithRelations) => {
    return (
      <div className='space-y-4'>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <h4 className='text-sm font-medium text-muted-foreground'>
              Período
            </h4>
            <p className='text-sm'>
              {formatName(dayjs(affidavit.period).utc().format('MMMM YYYY'))}
            </p>
          </div>
          <div>
            <h4 className='text-sm font-medium text-muted-foreground'>Tasa</h4>
            <p className='text-sm'>
              {formatName(affidavit.declarable_tax?.name ?? '-')}
            </p>
          </div>
          <div>
            <h4 className='text-sm font-medium text-muted-foreground'>
              Importe Declarado
            </h4>
            <p className='text-sm'>
              {formatNumberToCurrency(affidavit.declared_amount)}
            </p>
          </div>
          <div>
            <h4 className='text-sm font-medium text-muted-foreground'>
              Importe Determinado
            </h4>
            <p className='text-sm'>
              {formatNumberToCurrency(affidavit.fee_amount)}
            </p>
          </div>
          <div>
            <h4 className='text-sm font-medium text-muted-foreground'>
              Vencimiento Pago
            </h4>
            <p className='text-sm'>
              {dayjs(affidavit.payment_due_date).format('DD/MM/YYYY')}
            </p>
          </div>
          <div>
            <h4 className='text-sm font-medium text-muted-foreground'>
              Estado
            </h4>
            <Badge variant={getStatusVariant(affidavit.status)}>
              {STATUS_DICTIONARY[affidavit.status]}
            </Badge>
          </div>
        </div>
        <Separator />
        <div>
          <DialogTitle className='mb-4'>Detalles Adicionales</DialogTitle>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <h4 className='text-sm font-medium text-muted-foreground'>
                Fecha de Creación
              </h4>
              <p className='text-sm'>
                {dayjs(affidavit.created_at).format('DD/MM/YYYY HH:mm')}
              </p>
            </div>
            <div>
              <h4 className='text-sm font-medium text-muted-foreground'>
                Última Actualización
              </h4>
              <p className='text-sm'>
                {dayjs(affidavit.updated_at).format('DD/MM/YYYY HH:mm')}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getStatusVariant = (
    status: affidavit_status
  ): BadgeProps['variant'] => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'refused':
        return 'error';
      case 'under_review':
        return 'warning';
      case 'pending_payment':
        return 'info';
      default:
        return 'default';
    }
  };

  const handleOpenDialog = (affidavit: AffidavitWithRelations) => {
    setSelectedAffidavit(affidavit);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedAffidavit(null);
  };

  const columns: ColumnDef<AffidavitWithRelations>[] = [
    {
      id: 'period',
      accessorKey: 'period',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='PERÍODO' />
      ),
      cell: ({ row }) =>
        formatName(dayjs(row.original.period).utc().format('MMMM YYYY')),
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
      id: 'declared_amount',
      accessorKey: 'declared_amount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='IMPORTE DECLARADO' />
      ),
      cell: ({ row }) => formatNumberToCurrency(row.original.fee_amount),
      enableSorting: true,
    },
    {
      id: 'fee_amount',
      accessorKey: 'fee_amount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='IMPORTE DETERMINADO' />
      ),
      cell: ({ row }) => formatNumberToCurrency(row.original.fee_amount),
      enableSorting: true,
    },
    {
      id: 'due_date',
      accessorKey: 'due_date',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='VENCIMIENTO PAGO' />
      ),
      cell: ({ row }) =>
        dayjs(row.original.payment_due_date).utc().format('DD/MM/YYYY'),
      enableSorting: true,
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='ESTADO' />
      ),
      cell: ({ row }) => (
        <Badge variant={getStatusVariant(row.original.status)}>
          {STATUS_DICTIONARY[row.original.status]}
        </Badge>
      ),
      enableSorting: false,
    },
    {
      id: 'actions',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='ACCIONES' />
      ),
      cell: ({ row }) => (
        <ActionButtons
          row={row.original}
          actions={[
            {
              label: 'Ver detalles',
              icon: <FileText size={18} />,
              onClick: () => handleOpenDialog(row.original),
            },
          ]}
        />
      ),
      enableSorting: false,
    },
  ];

  const filterableColumns: FilterableColumn<AffidavitWithRelations>[] = [
    {
      id: 'status',
      title: 'Estado',
      options: STATUS_OPTIONS,
      type: 'select',
    },
  ];

  return (
    <>
      <Toaster />
      <DataTable
        columns={columns}
        data={items ?? []}
        tableTitle='Declaraciones Juradas'
        pagination={pagination}
        getRowId={(row) => row.id}
        filterableColumns={filterableColumns}
        searchParams={{
          page: String(currentPage),
          limit: String(currentLimit),
          sort_by: currentSortBy || undefined,
          sort_direction: currentSortDirection || undefined,
          filters: activeFilters,
        }}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onSortingChange={handleSortingChange}
        onFilterChange={handleFilterChange}
      />

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className='max-w-3xl'>
          <DialogHeader>
            <DialogTitle>Detalles de la Declaración Jurada</DialogTitle>
          </DialogHeader>
          <ScrollArea className='h-[600px] pr-4'>
            {selectedAffidavit && renderAffidavitDetails(selectedAffidavit)}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
