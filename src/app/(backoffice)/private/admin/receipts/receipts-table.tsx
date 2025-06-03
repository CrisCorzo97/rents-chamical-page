'use client';

import { ColumnDef } from '@tanstack/react-table';
import { formatName, formatNumberToCurrency } from '@/lib/formatters';
import { DataTable, DataTableColumnHeader } from '@/components/custom-table';
import { TableData } from '@/types/envelope';
import { useDataTableURLParams } from '@/hooks/useDataTableURLParams';
import { ActionButtons } from '@/components/custom-table/action-buttons';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { FileText } from 'lucide-react';
import { FilterableColumn } from '@/components/custom-table/data-table-toolbar';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { receipt } from '@prisma/client';
dayjs.locale('es');

export function ReceiptsTable({ items, pagination }: TableData<receipt>) {
  const [selectedRecord, setSelectedRecord] = useState<receipt | null>(null);
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

  const renderReceiptDetails = (record: receipt) => {
    return (
      <div className='space-y-4'>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <h4 className='text-sm font-medium text-muted-foreground'>
              Contribuyente
            </h4>
            <p className='text-sm'>{formatName(record.taxpayer)}</p>
          </div>
          <div>
            <h4 className='text-sm font-medium text-muted-foreground'>
              Tasa / Contribución
            </h4>
            <p className='text-sm'>{formatName(record.tax_type)}</p>
          </div>
          <div>
            <h4 className='text-sm font-medium text-muted-foreground'>
              Importe
            </h4>
            <p className='text-sm'>{formatNumberToCurrency(record.amount)}</p>
          </div>
          <div>
            <h4 className='text-sm font-medium text-muted-foreground'>
              Fecha de Confirmación
            </h4>
            <p className='text-sm'>
              {record.confirmed_at
                ? dayjs(record.confirmed_at).format('DD/MM/YYYY HH:mm')
                : '-'}
            </p>
          </div>
        </div>
        <Separator />
        <div>
          <DialogTitle className='mb-4'>Información del Sistema</DialogTitle>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <h4 className='text-sm font-medium text-muted-foreground'>
                Fecha de Creación
              </h4>
              <p className='text-sm'>
                {dayjs(record.created_at).format('DD/MM/YYYY HH:mm')}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleOpenDialog = (record: receipt) => {
    setSelectedRecord(record);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedRecord(null);
  };

  const columns: ColumnDef<receipt>[] = [
    {
      id: 'id',
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='NÚMERO DE COMPROBANTE' />
      ),
      cell: ({ row }) => row.original.id,
      enableSorting: true,
    },
    {
      id: 'taxpayer',
      accessorKey: 'taxpayer',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='CONTRIBUYENTE' />
      ),
      cell: ({ row }) => formatName(row.original.taxpayer),
      enableSorting: true,
    },
    {
      id: 'tax_type',
      accessorKey: 'tax_type',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='TASA / CONTRIBUCIÓN' />
      ),
      cell: ({ row }) => formatName(row.original.tax_type),
      enableSorting: true,
    },
    {
      id: 'amount',
      accessorKey: 'amount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='IMPORTE' />
      ),
      cell: ({ row }) => formatNumberToCurrency(row.original.amount),
      enableSorting: true,
    },
    {
      id: 'confirmed_at',
      accessorKey: 'confirmed_at',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='FECHA DE CONFIRMACIÓN' />
      ),
      cell: ({ row }) =>
        row.original.confirmed_at
          ? dayjs(row.original.confirmed_at).format('DD/MM/YYYY HH:mm')
          : '-',
      enableSorting: true,
    },
    {
      id: 'actions',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='ACCIONES' />
      ),
      cell: ({ row }) => {
        const actions = [
          {
            label: 'Ver detalles',
            icon: <FileText className='h-4 w-4' />,
            onClick: () => handleOpenDialog(row.original),
          },
        ];

        return <ActionButtons row={row.original} actions={actions} />;
      },
    },
  ];

  const filterableColumns: FilterableColumn<receipt>[] = [
    {
      id: 'id',
      title: 'Nro Comprobante',
      type: 'text',
    },
    {
      id: 'taxpayer',
      title: 'Contribuyente',
      type: 'text',
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={items}
        tableTitle='Comprobantes de Pago'
        filterableColumns={filterableColumns}
        pagination={pagination}
        searchParams={{
          page: currentPage.toString(),
          limit: currentLimit.toString(),
          sort_by: currentSortBy ?? undefined,
          sort_direction: currentSortDirection ?? undefined,
          filters: activeFilters,
        }}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onSortingChange={handleSortingChange}
        onFilterChange={handleFilterChange}
      />

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Detalles del Recibo</DialogTitle>
            <DialogDescription>ID: {selectedRecord?.id}</DialogDescription>
          </DialogHeader>
          <ScrollArea className='max-h-[80vh]'>
            {selectedRecord && renderReceiptDetails(selectedRecord)}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
