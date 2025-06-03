'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CommercialEnablementWithRelations } from './commercial_enablement.interface';
import { formatName } from '@/lib/formatters';
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
import { FileText, Pencil } from 'lucide-react';
import { FilterableColumn } from '@/components/custom-table/data-table-toolbar';
import dayjs from 'dayjs';

export function CommercialEnablementTable({
  items,
  pagination,
}: TableData<CommercialEnablementWithRelations>) {
  const [selectedRecord, setSelectedRecord] =
    useState<CommercialEnablementWithRelations | null>(null);
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

  const renderCommercialEnablementDetails = (
    record: CommercialEnablementWithRelations
  ) => {
    return (
      <div className='space-y-4'>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <h4 className='text-sm font-medium text-muted-foreground'>
              Contribuyente
            </h4>
            <p className='text-sm'>{formatName(record.taxpayer ?? '-')}</p>
          </div>
          <div>
            <h4 className='text-sm font-medium text-muted-foreground'>
              Razón Social
            </h4>
            <p className='text-sm'>{formatName(record.company_name ?? '-')}</p>
          </div>
          <div>
            <h4 className='text-sm font-medium text-muted-foreground'>
              Rubro Principal
            </h4>
            <p className='text-sm'>
              {record.commercial_activity?.activity ?? '-'}
            </p>
          </div>
          <div>
            <h4 className='text-sm font-medium text-muted-foreground'>
              Dirección
            </h4>
            <p className='text-sm'>{`${record.address ?? '-'} ${
              record.address_number ?? ''
            }`}</p>
          </div>
          <div>
            <h4 className='text-sm font-medium text-muted-foreground'>
              Fecha de Alta
            </h4>
            <p className='text-sm'>
              {record.registration_date
                ? dayjs(record.registration_date).format('DD/MM/YYYY')
                : '-'}
            </p>
          </div>
          <div>
            <h4 className='text-sm font-medium text-muted-foreground'>
              Fecha de Baja
            </h4>
            <p className='text-sm'>
              {record.cancellation_date
                ? dayjs(record.cancellation_date).format('DD/MM/YYYY')
                : '-'}
            </p>
          </div>
          <div>
            <h4 className='text-sm font-medium text-muted-foreground'>
              Comprobante de Alta
            </h4>
            <p className='text-sm'>
              {record.registration_receipt ? record.registration_receipt : '-'}
            </p>
          </div>
        </div>
        <Separator />
        <div>
          <DialogTitle className='mb-4'>Información Adicional</DialogTitle>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <h4 className='text-sm font-medium text-muted-foreground'>
                Barrio
              </h4>
              <p className='text-sm'>{record.neighborhood?.name ?? '-'}</p>
            </div>
            <div>
              <h4 className='text-sm font-medium text-muted-foreground'>
                Sección
              </h4>
              <p className='text-sm'>{record.city_section?.name ?? '-'}</p>
            </div>
            <div>
              <h4 className='text-sm font-medium text-muted-foreground'>
                Manzana
              </h4>
              <p className='text-sm'>{record.block ?? '-'}</p>
            </div>
            <div>
              <h4 className='text-sm font-medium text-muted-foreground'>
                Parcela
              </h4>
              <p className='text-sm'>{record.parcel ?? '-'}</p>
            </div>
            <div>
              <h4 className='text-sm font-medium text-muted-foreground'>
                Último Año Abonado
              </h4>
              <p className='text-sm'>{record.last_year_paid ?? '-'}</p>
            </div>
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
                {record.created_at
                  ? dayjs(record.created_at).format('DD/MM/YYYY')
                  : '-'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleOpenDialog = (record: CommercialEnablementWithRelations) => {
    setSelectedRecord(record);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedRecord(null);
  };

  const columns: ColumnDef<CommercialEnablementWithRelations>[] = [
    {
      id: 'tax_id',
      accessorKey: 'tax_id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='CUIT' />
      ),
      enableSorting: true,
    },
    {
      id: 'taxpayer',
      accessorKey: 'taxpayer',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='CONTRIBUYENTE' />
      ),
      cell: ({ row }) => formatName(row.original.taxpayer ?? '-'),
      enableSorting: true,
    },
    {
      id: 'company_name',
      accessorKey: 'company_name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='RAZÓN SOCIAL' />
      ),
      cell: ({ row }) => formatName(row.original.company_name ?? '-'),
      enableSorting: true,
    },
    {
      id: 'commercial_activity',
      accessorKey: 'commercial_activity',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='ACTIVIDAD PRINCIPAL' />
      ),
      cell: ({ row }) => row.original.commercial_activity?.activity ?? '-',
      enableSorting: false,
    },
    {
      id: 'address',
      accessorKey: 'address',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='DIRECCIÓN' />
      ),
      cell: ({ row }) =>
        `${row.original.address ?? '-'} ${row.original.address_number ?? ''}`,
      enableSorting: false,
    },
    {
      id: 'registration_date',
      accessorKey: 'registration_date',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='FECHA DE ALTA' />
      ),
      cell: ({ row }) =>
        row.original.registration_date
          ? dayjs(row.original.registration_date).format('DD/MM/YYYY')
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
          {
            label: 'Editar',
            icon: <Pencil className='h-4 w-4' />,
            href: `/private/admin/commercial_enablement/edit/${row.original.id}`,
            onClick: () => {},
          },
        ];

        return <ActionButtons row={row.original} actions={actions} />;
      },
    },
  ];

  const filterableColumns: FilterableColumn<CommercialEnablementWithRelations>[] =
    [
      {
        id: 'tax_id',
        title: 'CUIT',
        type: 'text',
      },
      {
        id: 'taxpayer',
        title: 'Contribuyente',
        type: 'text',
      },
      {
        id: 'company_name',
        title: 'Razón Social',
        type: 'text',
      },
    ];

  return (
    <>
      <DataTable
        columns={columns}
        data={items}
        tableTitle='Habilitaciones Comerciales'
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
            <DialogTitle>Detalles de la Habilitación Comercial</DialogTitle>
            <DialogDescription>ID: {selectedRecord?.id}</DialogDescription>
          </DialogHeader>
          <ScrollArea className='max-h-[80vh]'>
            {selectedRecord &&
              renderCommercialEnablementDetails(selectedRecord)}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
