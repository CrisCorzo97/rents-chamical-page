'use client';

import { Banknote } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { InvoiceWithRelations } from './collection_management.interface';
import { formatName, formatNumberToCurrency } from '@/lib/formatters';
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCallback, useMemo, useState, useTransition } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Eye, Check, X, FileText, Upload } from 'lucide-react';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { FilterableColumn } from '@/components/custom-table/data-table-toolbar';
import { affidavit_status } from '@prisma/client';
import { Label } from '@/components/ui/label';
import { acceptPayment, rejectPayment, uploadAttachment } from './actions';
import { FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/toaster';
import { ReceiptPDFProps } from './components/receiptPDF';
import { PDFUploader } from './components/PDFUploader';

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

export function CollectionManagementTable({
  items,
  pagination,
}: TableData<InvoiceWithRelations>) {
  const [selectedRecord, setSelectedRecord] =
    useState<InvoiceWithRelations | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fileToUpload, setFileToUpload] = useState<{
    invoice?: InvoiceWithRelations;
    attachment?: File;
  } | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState<boolean>(false);
  const [isUploading, startUploading] = useTransition();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [isConfirmingCashPayment, startConfirmingCashPayment] = useTransition();
  const [contentDialog, setContentDialog] = useState<ReceiptPDFProps['data']>({
    receiptId: '',
    taxpayer: '',
    taxId: '',
    taxOrContibution: '',
    observations: '',
    amount: 0,
  });

  const stableData = useMemo(
    () => contentDialog,
    [JSON.stringify(contentDialog)]
  );
  const stableInvoice = useMemo(
    () => selectedRecord,
    [selectedRecord?.id]
  );

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

  const renderInvoiceDetails = (record: InvoiceWithRelations) => {
    return (
      <div className='space-y-4'>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <h4 className='text-sm font-medium text-muted-foreground'>
              Contribuyente
            </h4>
            <p className='text-sm'>
              {formatName(
                `${record.user?.first_name ?? '-'} ${
                  record.user?.last_name ?? ''
                }`
              )}
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
              Importe Total
            </h4>
            <p className='text-sm'>
              {formatNumberToCurrency(record.total_amount)}
            </p>
          </div>
          <div>
            <h4 className='text-sm font-medium text-muted-foreground'>
              Fecha de Pago
            </h4>
            <p className='text-sm'>
              {record.payment_date
                ? dayjs(record.payment_date).utc().format('DD/MM/YYYY HH:mm')
                : '-'}
            </p>
          </div>
        </div>
        <Separator />
        <div>
          <DialogTitle className='mb-4'>Declaraciones Juradas</DialogTitle>
          <div className='space-y-4'>
            {record.affidavit?.map((affidavit) => (
              <div key={affidavit.id} className='grid grid-cols-2 gap-4'>
                <div>
                  <h4 className='text-sm font-medium text-muted-foreground'>
                    Tipo de Declaración
                  </h4>
                  <p className='text-sm'>
                    {formatName(affidavit.declarable_tax?.name ?? '-')}
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
                <div>
                  <h4 className='text-sm font-medium text-muted-foreground'>
                    Período
                  </h4>
                  <p className='text-sm'>
                    {formatName(
                      dayjs(affidavit.period).utc().format('MMMM YYYY')
                    )}
                  </p>
                </div>
                <div>
                  <h4 className='text-sm font-medium text-muted-foreground'>
                    Importe determinado
                  </h4>
                  <p className='text-sm'>
                    {formatNumberToCurrency(affidavit.fee_amount)}
                  </p>
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
                        {formatName(
                          dayjs(penalty.period).utc().format('MMMM YYYY')
                        )}
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

  const handleOpenDialog = (record: InvoiceWithRelations) => {
    setSelectedRecord(record);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedRecord(null);
  };

  const handleOpenUploadDialog = (row: InvoiceWithRelations) => {
    setUploadDialogOpen(true);
    setFileToUpload((prev) => ({
      invoice: row,
      ...prev,
    }));
  };

  const handleAcceptCashPayment = (record: InvoiceWithRelations) => {
    startConfirmingCashPayment(async () => {
      try {
        const { data, error } = await acceptPayment(record);

        if (error || !data) {
          throw new Error(error ?? 'Hubo un error al aprobar el pago');
        }

        setContentDialog({
          receiptId: record.id,
          taxpayer: formatName(
            `${record.user?.first_name ?? '-'} ${record.user?.last_name ?? ''}`
          ),
          taxId: record.user?.cuil ?? '',
          taxOrContibution: record.affidavit?.[0]?.declarable_tax?.name ?? '',
          observations: '',
          amount: record.total_amount,
        });

        setSelectedRecord(record);

        // const blob = await generatePdfBlob({
        //   receiptId: record.id,
        //   taxpayer: formatName(
        //     `${record.user?.first_name ?? '-'} ${record.user?.last_name ?? ''}`
        //   ),
        //   taxId: record.user?.cuil ?? '',
        //   taxOrContibution: record.affidavit?.[0]?.declarable_tax?.name ?? '',
        //   observations: '',
        //   amount: record.total_amount,
        // });

        // const attachment = new File([blob], `${record.id}.pdf`, {
        //   type: 'application/pdf',
        // });

        // console.log({ attachment });

        // handleUploadFile({ file: attachment, invoice: record });

        toast.success('Pago aprobado correctamente');
        setConfirmDialogOpen(true);
      } catch (error) {
        console.error(error);
        if (error instanceof Error) {
          toast.error(error.message);
        }
        toast.error('Hubo un error al aprobar el pago');
      }
    });
  };

  const handleUploadFile = useCallback(
    (input?: { file?: File; invoice?: InvoiceWithRelations }) => {
      startUploading(async () => {
        if (fileToUpload || input) {
          try {
            const { error } = await uploadAttachment({
              invoice: input?.invoice! ?? fileToUpload?.invoice!,
              attachment: input?.file! ?? fileToUpload?.attachment!,
            });

            if (error) {
              throw new Error(error);
            }

            toast.success('Comprobante de pago subido correctamente');

            if (!input?.file) {
              setUploadDialogOpen(false);
              setFileToUpload(null);
            }
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
      id: 'user',
      accessorKey: 'user',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='CONTRIBUYENTE' />
      ),
      cell: ({ row }) =>
        formatName(
          `${row.original.user?.first_name ?? '-'} ${
            row.original.user?.last_name ?? ''
          }`
        ),
      enableSorting: false,
    },
    {
      id: 'user.cuil',
      accessorKey: 'user.cuil',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='CUIT' />
      ),
      cell: ({ row }) => row.original.user?.cuil,
      enableSorting: false,
    },
    {
      id: 'declarable_tax',
      accessorKey: 'declarable_tax',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='TASA' />
      ),
      cell: ({ row }) => {
        let declarable_tax = '-';

        if (row.original.affidavit?.length) {
          declarable_tax = row.original.affidavit[0].declarable_tax?.name ?? '';
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
      cell: ({ row }) =>
        dayjs(row.original.due_date).utc().format('DD/MM/YYYY'),
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
          ? dayjs(row.original.payment_date).utc().format('DD/MM/YYYY HH:mm')
          : '-',
      enableSorting: true,
    },
    {
      id: 'total_amount',
      accessorKey: 'total_amount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='MONTO TOTAL' />
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
        const actions = [
          {
            label: 'Ver detalles',
            icon: <FileText className='h-4 w-4' />,
            onClick: () => handleOpenDialog(row.original),
          },
          {
            label: 'Ver comprobante',
            icon: <Eye className='h-4 w-4' />,
            onClick: () => {},
            href: row.original.attached_receipt ?? '',
          },
          {
            label: 'Subir comprobante',
            icon: <Upload className='h-4 w-4' />,
            onClick: () => handleOpenUploadDialog(row.original),
            disabled: row.original.attached_receipt !== null,
          },
          {
            label: 'Cobro en efectivo',
            icon: <Banknote className='h-4 w-4' />,
            onClick: () => handleAcceptCashPayment(row.original),
            disabled: row.original.status === 'approved',
          },
          {
            label: 'Aprobar',
            icon: <Check className='h-4 w-4' />,
            onClick: () => acceptPayment(row.original),
            disabled: row.original.status === 'approved',
          },
          {
            label: 'Rechazar',
            icon: <X className='h-4 w-4' />,
            onClick: () => rejectPayment(row.original),
            disabled: row.original.status === 'refused',
          },
        ];

        return <ActionButtons row={row.original} actions={actions} />;
      },
    },
  ];

  const filterableColumns: FilterableColumn<InvoiceWithRelations>[] = [
    {
      id: 'id',
      title: 'Número',
      type: 'text',
    },
    {
      id: 'user',
      title: 'Contribuyente',
      type: 'text',
    },
    {
      id: 'taxpayer_id',
      title: 'CUIT',
      type: 'text',
    },
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
        data={items}
        tableTitle='Gestión de Cobranza'
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
            <DialogTitle>
              Detalles de la factura {selectedRecord?.id}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className='max-h-[80vh]'>
            {selectedRecord && renderInvoiceDetails(selectedRecord)}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className='sm:max-w-[425px] space-y-4' hiddenCloseButton>
          <DialogHeader>
            <DialogTitle>Cargar comprobante de pago</DialogTitle>
            <DialogDescription>
              Sube el comprobante de pago para la factura seleccionada.
            </DialogDescription>
          </DialogHeader>
          <FormItem>
            <Label htmlFor='file-upload'>Selecciona un archivo:</Label>
            <Input
              id='file-upload'
              type='file'
              accept='.pdf,.jpg,.jpeg,.png'
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setFileToUpload((prev) => ({
                    ...prev!,
                    attachment: e.target.files![0],
                  }));
                }
              }}
            />
          </FormItem>
          <DialogFooter className='flex items-center gap-1'>
            <Button
              variant='outline'
              onClick={() => {
                setUploadDialogOpen(false);
                setFileToUpload(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              disabled={!fileToUpload}
              onClick={() => handleUploadFile()}
              loading={isUploading}
            >
              Subir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className='flex flex-col min-h-[90vh] min-w-screen max-w-screen-2xl'>
          <DialogHeader>
            <DialogTitle>Comprobante de pago</DialogTitle>
            <DialogDescription>
              Imprime y entrega el comprobante de pago al contribuyente.
            </DialogDescription>
          </DialogHeader>

          {selectedRecord && contentDialog && (
            <PDFUploader
              data={stableData}
              invoice={stableInvoice}
              onUploaded={(file, invoice) => {
                handleUploadFile({ file, invoice });
              }}
            />
          )}

          <DialogFooter className='flex-none'>
            <Button onClick={() => setConfirmDialogOpen(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
