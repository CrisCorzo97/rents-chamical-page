'use client';

import { ColumnDef } from '@tanstack/react-table';
import { formatName, formatNumberToCurrency } from '@/lib/formatters';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { affidavit_status } from '@prisma/client';
import locale from 'dayjs/locale/es';
import { Eye, FileText, Upload } from 'lucide-react';
import { DataTable, DataTableColumnHeader } from '@/components/custom-table';
import { TableData } from '@/types/envelope';
import { useDataTableURLParams } from '@/hooks/useDataTableURLParams';
import { FilterableColumn } from '@/components/custom-table/data-table-toolbar';
import {
  Action,
  ActionButtons,
} from '@/components/custom-table/action-buttons';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCallback, useState, useTransition } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Toaster } from '@/components/ui/toaster';
import { TableSkeleton } from '@/components/custom-table/table-skeleton';
import { InvoiceWithRelations } from '../types/types';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
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

export const InvoicesTableSkeleton = () => {
  return (
    <Card className='col-span-12 2xl:col-span-10'>
      <CardContent>
        <TableSkeleton title='Facturas' columns={6} rows={5} />
      </CardContent>
    </Card>
  );
};

export function InvoicesTable({
  items,
  pagination,
}: TableData<InvoiceWithRelations>) {
  const [selectedInvoice, setSelectedInvoice] =
    useState<InvoiceWithRelations | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState<boolean>(false);
  const [fileToUpload, setFileToUpload] = useState<{
    invoice?: InvoiceWithRelations;
    attachment?: File;
  } | null>(null);
  const [isUploading, startUploading] = useTransition();

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

  const handleOpenUploadDialog = (row: InvoiceWithRelations) => {
    setUploadDialogOpen(true);
    setFileToUpload((prev) => ({
      invoice: row,
      ...prev,
    }));
  };

  const handleUploadFile = useCallback(
    (input?: { file?: File; invoice?: InvoiceWithRelations }) => {
      startUploading(async () => {
        if (fileToUpload || input) {
          try {
            // const { error } = await uploadAttachment({
            //   invoice: input?.invoice! ?? fileToUpload?.invoice!,
            //   attachment: input?.file! ?? fileToUpload?.attachment!,
            // });
            // if (error) {
            //   throw new Error(error);
            // }
            // toast.success('Comprobante de pago subido correctamente');
            // if (!input?.file) {
            //   setUploadDialogOpen(false);
            //   setFileToUpload(null);
            // }
          } catch (error) {
            console.error(error);
            if (error instanceof Error) {
              toast.error(error.message);
            }
            toast.error('Hubo un error al subir el comprobante de pago');
          }
        }
      });
    },
    [fileToUpload]
  );

  const renderInvoiceDetails = (record: InvoiceWithRelations) => {
    return (
      <div className='space-y-4'>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <h4 className='text-sm font-medium text-muted-foreground'>
              Importe seleccionado
            </h4>
            <p className='text-sm'>
              {formatNumberToCurrency(record.fee_amount)}
            </p>
          </div>
          <div>
            <h4 className='text-sm font-medium text-muted-foreground'>
              Intereses
            </h4>
            <p className='text-sm'>
              {formatNumberToCurrency(record.compensatory_interest ?? 0)}
            </p>
          </div>
          <div>
            <h4 className='text-sm font-medium text-muted-foreground'>
              Importe Total
            </h4>
            <p className='text-sm'>
              {formatNumberToCurrency(record.total_amount)}
            </p>
          </div>
          <div>
            <h4 className='text-sm font-medium text-muted-foreground'>
              Estado
            </h4>
            <Badge variant={getStatusVariant(record.status)}>
              {STATUS_DICTIONARY[record.status]}
            </Badge>
          </div>
          <div>
            <h4 className='text-sm font-medium text-muted-foreground'>
              Fecha de Pago
            </h4>
            <p className='text-sm'>
              {record.payment_date
                ? dayjs(record.payment_date).format('DD/MM/YYYY HH:mm')
                : '-'}
            </p>
          </div>
        </div>
        <Separator />
        <div>
          <DialogTitle className='mb-4'>Declaraciones Juradas</DialogTitle>
          <div className='space-y-4'>
            {record.affidavit?.map((affidavit) => (
              <div key={affidavit.id} className='flex flex-col gap-4'>
                <div className='rounded-md border'>
                  <table className='w-full'>
                    <thead className='bg-muted'>
                      <tr className='border-b'>
                        <th className='px-4 py-2 text-sm font-medium text-muted-foreground'>
                          Período
                        </th>
                        <th className='px-4 py-2 text-sm font-medium text-muted-foreground'>
                          Tasa / Contribución
                        </th>
                        <th className='px-4 py-2 text-sm font-medium text-muted-foreground'>
                          Importe determinado
                        </th>
                        <th className='px-4 py-2 text-sm font-medium text-muted-foreground'>
                          Estado
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className='px-4 py-2 text-sm'>
                          {formatName(
                            dayjs(affidavit.period).utc().format('MMMM YYYY')
                          )}
                        </td>
                        <td className='px-4 py-2 text-sm'>
                          {formatName(affidavit.declarable_tax?.name ?? '-')}
                        </td>
                        <td className='px-4 py-2 text-sm'>
                          {formatNumberToCurrency(affidavit.fee_amount)}
                        </td>
                        <td className='px-4 py-2 text-sm'>
                          <Badge
                            variant={getStatusVariant(affidavit.status)}
                            className='text-xs'
                          >
                            {STATUS_DICTIONARY[affidavit.status]}
                          </Badge>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
        {record.tax_penalties && record.tax_penalties.length > 0 && (
          <>
            <Separator />
            <div>
              <DialogTitle className='mb-4'>Multas</DialogTitle>
              <div className='space-y-4'>
                {record.tax_penalties.map((penalty) => (
                  <div key={penalty.id} className='grid grid-cols-2 gap-4'>
                    <div>
                      <h4 className='text-sm font-medium text-muted-foreground'>
                        Tipo de Multa
                      </h4>
                      <p className='text-sm'>
                        {formatName(penalty.declarable_tax?.name ?? '-')}
                      </p>
                    </div>
                    <div>
                      <h4 className='text-sm font-medium text-muted-foreground'>
                        Período
                      </h4>
                      <p className='text-sm'>
                        {formatName(dayjs(penalty.period).format('MMMM YYYY'))}
                      </p>
                    </div>
                    <div>
                      <h4 className='text-sm font-medium text-muted-foreground'>
                        Importe
                      </h4>
                      <p className='text-sm'>
                        {formatNumberToCurrency(penalty.amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
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
            <div>
              <h4 className='text-sm font-medium text-muted-foreground'>
                Última Actualización
              </h4>
              <p className='text-sm'>
                {record.updated_at
                  ? dayjs(record.updated_at).format('DD/MM/YYYY HH:mm')
                  : '-'}
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

  const handleOpenDialog = (invoice: InvoiceWithRelations) => {
    setSelectedInvoice(invoice);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedInvoice(null);
  };

  const columns: ColumnDef<InvoiceWithRelations>[] = [
    {
      id: 'id',
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='NÚMERO' />
      ),
      cell: ({ row }) => row.original.id,
      enableSorting: true,
    },
    {
      id: 'due_date',
      accessorKey: 'due_date',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='VENCIMIENTO DE PAGO' />
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
      cell: ({ row }) =>
        row.original.payment_date
          ? dayjs(row.original.payment_date).format('DD/MM/YYYY HH:mm')
          : '-',
      enableSorting: true,
    },
    {
      id: 'total_amount',
      accessorKey: 'total_amount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='IMPORTE TOTAL' />
      ),
      cell: ({ row }) => formatNumberToCurrency(row.original.total_amount),
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
      enableSorting: true,
    },
    {
      id: 'actions',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='ACCIONES' />
      ),
      cell: ({ row }) => {
        const actions: Action[] = [
          {
            label: 'Ver detalles',
            icon: <FileText className='h-4 w-4' />,
            onClick: () => handleOpenDialog(row.original),
          },
          {
            label: 'Ver comprobante adjunto',
            icon: <Eye className='h-4 w-4' />,
            onClick: () => {},
            href: row.original.attached_receipt ?? '',
            targetBlank: true,
          },
          {
            label: 'Subir comprobante',
            icon: <Upload className='h-4 w-4' />,
            onClick: () => handleOpenUploadDialog(row.original),
            disabled: row.original.attached_receipt !== null,
          },
        ];

        return <ActionButtons row={row.original} actions={actions} />;
      },
    },
  ];

  const filterableColumns: FilterableColumn<InvoiceWithRelations>[] = [
    {
      id: 'status',
      title: 'Estado',
      options: STATUS_OPTIONS,
      type: 'select',
    },
  ];

  return (
    <Card className='col-span-12 2xl:col-span-10'>
      <CardContent>
        <Toaster />
        <DataTable
          columns={columns}
          data={items ?? []}
          tableTitle='Facturas'
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
              <DialogTitle>Detalles de la Factura</DialogTitle>
            </DialogHeader>
            <ScrollArea className='h-[calc(90vh-8rem)] pr-4'>
              {selectedInvoice && renderInvoiceDetails(selectedInvoice)}
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
