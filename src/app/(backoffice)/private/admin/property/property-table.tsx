'use client';

import { ColumnDef } from '@tanstack/react-table';
import { PropertyRecordWithRelations } from './property.interface';
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
import 'dayjs/locale/es';

dayjs.locale('es');

export function PropertyTable({
  items,
  pagination,
}: TableData<PropertyRecordWithRelations>) {
  const [selectedRecord, setSelectedRecord] =
    useState<PropertyRecordWithRelations | null>(null);
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

  const renderPropertyDetails = (record: PropertyRecordWithRelations) => {
    return (
      <div className='space-y-4'>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <h4 className='text-sm font-medium text-muted-foreground'>
              Contribuyente
            </h4>
            <p className='text-sm'>{formatName(record.taxpayer ?? '')}</p>
          </div>
          <div>
            <h4 className='text-sm font-medium text-muted-foreground'>
              Tipo de Contribuyente
            </h4>
            <p className='text-sm'>{record.taxpayer_type ?? '-'}</p>
          </div>
          <div>
            <h4 className='text-sm font-medium text-muted-foreground'>
              Dirección
            </h4>
            <p className='text-sm'>{formatName(record.address ?? '-')}</p>
          </div>
          <div>
            <h4 className='text-sm font-medium text-muted-foreground'>
              Barrio
            </h4>
            <p className='text-sm'>
              {formatName(record.neighborhood?.name ?? '-')}
            </p>
          </div>
          <div>
            <h4 className='text-sm font-medium text-muted-foreground'>
              Sección
            </h4>
            <p className='text-sm'>{record.city_section?.name ?? '-'}</p>
          </div>
          <div>
            <h4 className='text-sm font-medium text-muted-foreground'>
              Último Año de Pago
            </h4>
            <p className='text-sm'>{record.last_year_paid ?? '-'}</p>
          </div>
        </div>
        <Separator />
        <div>
          <DialogTitle className='mb-4'>Información Catastral</DialogTitle>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <h4 className='text-sm font-medium text-muted-foreground'>
                Matrícula
              </h4>
              <p className='text-sm'>{record.enrollment ?? '-'}</p>
            </div>
            <div>
              <h4 className='text-sm font-medium text-muted-foreground'>
                Mts Frente
              </h4>
              <p className='text-sm'>{record.front_length ?? '-'} mts</p>
            </div>
            <div>
              <h4 className='text-sm font-medium text-muted-foreground'>
                Es Parte
              </h4>
              <p className='text-sm'>{record.is_part ? 'SI' : 'NO'}</p>
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
            <div>
              <h4 className='text-sm font-medium text-muted-foreground'>
                Última Modificación
              </h4>
              <p className='text-sm'>
                {record.updated_at
                  ? dayjs(record.updated_at).format('DD/MM/YYYY')
                  : '-'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleOpenDialog = (record: PropertyRecordWithRelations) => {
    setSelectedRecord(record);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedRecord(null);
  };

  const columns: ColumnDef<PropertyRecordWithRelations>[] = [
    {
      id: 'enrollment',
      accessorKey: 'enrollment',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='MATRÍCULA' />
      ),
      cell: ({ row }) => row.original.enrollment ?? '-',
      enableSorting: true,
    },
    {
      id: 'taxpayer',
      accessorKey: 'taxpayer',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='CONTRIBUYENTE' />
      ),
      cell: ({ row }) => formatName(row.original.taxpayer ?? '') ?? '-',
      enableSorting: true,
    },
    {
      id: 'taxpayer_type',
      accessorKey: 'taxpayer_type',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='TIPO DE CONTRIBUYENTE' />
      ),
      cell: ({ row }) => row.original.taxpayer_type ?? '-',
      enableSorting: true,
    },
    {
      id: 'address',
      accessorKey: 'address',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='DIRECCIÓN' />
      ),
      cell: ({ row }) => `${row.original.address ?? '-'}`,
      enableSorting: true,
    },
    {
      id: 'neighborhood',
      accessorKey: 'neighborhood',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='BARRIO' />
      ),
      cell: ({ row }) => formatName(row.original.neighborhood?.name ?? '-'),
      enableSorting: true,
    },
    {
      id: 'is_part',
      accessorKey: 'is_part',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='ES PARTE' />
      ),
      cell: ({ row }) => (row.original.is_part ? 'SI' : 'NO'),
      enableSorting: false,
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
            href: `/private/admin/property/edit/${row.original.id}`,
            onClick: () => {},
          },
        ];

        return <ActionButtons row={row.original} actions={actions} />;
      },
    },
  ];

  const filterableColumns: FilterableColumn<PropertyRecordWithRelations>[] = [
    {
      id: 'taxpayer',
      title: 'Contribuyente',
      type: 'text',
    },
    {
      id: 'enrollment',
      title: 'Matrícula',
      type: 'text',
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={items}
        tableTitle='Inmuebles'
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
            <DialogTitle>Detalles de la Propiedad</DialogTitle>
            <DialogDescription>ID: {selectedRecord?.id}</DialogDescription>
          </DialogHeader>
          <ScrollArea className='max-h-[80vh]'>
            {selectedRecord && renderPropertyDetails(selectedRecord)}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
