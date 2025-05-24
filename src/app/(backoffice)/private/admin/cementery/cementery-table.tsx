'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CementeryRecordWithRelations } from './cementery.interface';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import locale from 'dayjs/locale/es';
import { DataTable, DataTableColumnHeader } from '@/components/custom-table';
import { TableData } from '@/types/envelope';
import { useDataTableURLParams } from '@/hooks/useDataTableURLParams';
import { ActionButtons } from '@/components/custom-table/action-buttons';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Eye, Pencil } from 'lucide-react';
import { formatName } from '@/lib/formatters';
import { FilterableColumn } from '@/components/custom-table/data-table-toolbar';

dayjs.locale(locale);
dayjs.extend(utc);

export function CementeryTable({
  items,
  pagination,
}: TableData<CementeryRecordWithRelations>) {
  const [selectedRecord, setSelectedRecord] =
    useState<CementeryRecordWithRelations | null>(null);
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

  const renderCementeryDetails = (record: CementeryRecordWithRelations) => {
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
              Dirección del Contribuyente
            </h4>
            <p className='text-sm'>
              {formatName(record.address_taxpayer ?? '-')}
            </p>
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
              Tipo de Sepultura
            </h4>
            <p className='text-sm'>
              {formatName(record.burial_type?.type ?? '-')}
            </p>
          </div>
          <div>
            <h4 className='text-sm font-medium text-muted-foreground'>
              Nombre del Difunto
            </h4>
            <p className='text-sm'>{formatName(record.deceased_name ?? '-')}</p>
          </div>
          <div>
            <h4 className='text-sm font-medium text-muted-foreground'>Lugar</h4>
            <p className='text-sm'>
              {formatName(record.cementery_place?.name ?? '-')}
            </p>
          </div>
          <div>
            <h4 className='text-sm font-medium text-muted-foreground'>
              Sección
            </h4>
            <p className='text-sm'>{formatName(record.section ?? '-')}</p>
          </div>
          <div>
            <h4 className='text-sm font-medium text-muted-foreground'>Fila</h4>
            <p className='text-sm'>{record.row ?? '-'}</p>
          </div>
          <div>
            <h4 className='text-sm font-medium text-muted-foreground'>
              Número de Ubicación
            </h4>
            <p className='text-sm'>{record.location_number ?? '-'}</p>
          </div>
          <div>
            <h4 className='text-sm font-medium text-muted-foreground'>
              Último Año Pagado
            </h4>
            <p className='text-sm'>{record.last_year_paid ?? '-'}</p>
          </div>
        </div>
        <Separator />
        <div>
          <DialogTitle className='mb-4'>Información del Sistema</DialogTitle>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <h4 className='text-sm font-medium text-muted-foreground'>
                ID del Registro
              </h4>
              <p className='text-sm'>{record.id}</p>
            </div>
            <div>
              <h4 className='text-sm font-medium text-muted-foreground'>
                Fecha de Creación
              </h4>
              <p className='text-sm'>
                {dayjs(record.created_at).utc().format('DD/MM/YYYY HH:mm')}
              </p>
            </div>
            <div>
              <h4 className='text-sm font-medium text-muted-foreground'>
                Última Actualización
              </h4>
              <p className='text-sm'>
                {record.updated_at
                  ? dayjs(record.updated_at).utc().format('DD/MM/YYYY HH:mm')
                  : '-'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleOpenDialog = (record: CementeryRecordWithRelations) => {
    setSelectedRecord(record);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedRecord(null);
  };

  const columns: ColumnDef<CementeryRecordWithRelations>[] = [
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
      id: 'address_taxpayer',
      accessorKey: 'address_taxpayer',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='DIRECCIÓN' />
      ),
      cell: ({ row }) => formatName(row.original.address_taxpayer ?? '-'),
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
      id: 'deceased_name',
      accessorKey: 'deceased_name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='NOMBRE DIFUNTO' />
      ),
      cell: ({ row }) => formatName(row.original.deceased_name ?? '-'),
      enableSorting: true,
    },
    {
      id: 'cementery_place',
      accessorKey: 'cementery_place',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='LUGAR' />
      ),
      cell: ({ row }) => formatName(row.original.cementery_place?.name ?? '-'),
      enableSorting: true,
    },
    {
      id: 'last_year_paid',
      accessorKey: 'last_year_paid',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='ÚLTIMO AÑO PAGO' />
      ),
      cell: ({ row }) => row.original.last_year_paid ?? '-',
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
            icon: <Eye className='h-4 w-4' />,
            onClick: () => handleOpenDialog(row.original),
          },
          {
            label: 'Editar',
            icon: <Pencil className='h-4 w-4' />,
            onClick: () =>
              (window.location.href = `/private/admin/cementery/edit/${row.original.id}`),
          },
        ];

        return <ActionButtons row={row.original} actions={actions} />;
      },
    },
  ];

  const filterableColumns: FilterableColumn<CementeryRecordWithRelations>[] = [
    {
      id: 'taxpayer',
      title: 'Contribuyente',
      type: 'text',
    },
    {
      id: 'deceased_name',
      title: 'Nombre Difunto',
      type: 'text',
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={items}
        tableTitle='Registros de Cementerio'
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
            <DialogTitle>Detalles del Registro</DialogTitle>
          </DialogHeader>
          <ScrollArea className='max-h-[80vh]'>
            {selectedRecord && renderCementeryDetails(selectedRecord)}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
