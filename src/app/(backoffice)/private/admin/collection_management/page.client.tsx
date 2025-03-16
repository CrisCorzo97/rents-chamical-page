'use client';

import { Envelope, Pagination } from '@/types/envelope';
import { InvoiceWithRelations } from './collection_management.interface';
import {
  ColumnDef,
  getCoreRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useState, useTransition } from 'react';
import { useFPS } from '@/hooks';
import { DataTableColumnHeader } from '@/components/data-table';
import { formatName, formatNumberToCurrency } from '@/lib/formatters';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  FormItem,
  Input,
  Label,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import {
  Check,
  EllipsisVertical,
  Eye,
  FileText,
  FilterX,
  Upload,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { stateToSortBy } from '@/lib/table';
import { CustomDataTable } from '@/components/data-table/customDataTable';
import { cn } from '@/lib/cn';
import clsx from 'clsx';
import { Separator } from '@/components/ui/separator';
import dayjs from 'dayjs';
import locale from 'dayjs/locale/es';
import { affidavit_status } from '@prisma/client';
import { BadgeProps } from '@/components/ui/badge';
import { acceptPayment, rejectPayment, uploadAttachment } from './actions';
import { toast, Toaster } from 'sonner';

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
  const [recordDetails, setRecordDetails] =
    useState<InvoiceWithRelations | null>(null);
  const [fileToUpload, setFileToUpload] = useState<{
    invoice?: InvoiceWithRelations;
    attachment?: File;
  } | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState<boolean>(false);
  const [isUploading, startUploading] = useTransition();

  const { handleSort, handlePagination, handleFilter } = useFPS({
    pagination: data.pagination as Pagination,
  });

  const handleUploadFile = () => {
    startUploading(async () => {
      if (fileToUpload) {
        try {
          const { error } = await uploadAttachment({
            invoice: fileToUpload.invoice!,
            attachment: fileToUpload.attachment!,
          });

          if (error) {
            throw new Error(error);
          }

          toast.success('Comprobante de pago subido correctamente');
          setUploadDialogOpen(false);
          setFileToUpload(null);
        } catch (error) {
          console.error(error);
          if (error instanceof Error) {
            toast.error(error.message);
          }
          toast.error('Hubo un error al subir el comprobante de pago');
        }
      }
    });
  };

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
      cell: ({ row }) =>
        dayjs(row.original.payment_date).format('DD/MM/YYYY HH:mm'),
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='icon'>
                <EllipsisVertical size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56'>
              <DropdownMenuItem onClick={selectRecord}>
                <FileText size={18} className='mr-2 text-gray-700' />
                <span>Ver detalles</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href={row.original.attached_receipt ?? '#'}
                  target='_blank'
                  className='relative flex cursor-default select-none items-center'
                >
                  <Eye size={18} className='mr-2 text-gray-700' />
                  <span>Ver comprobante</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={row.original.attached_receipt !== null}
                onClick={() => {
                  setUploadDialogOpen(true);
                  setFileToUpload((prev) => ({
                    invoice: row.original,
                    ...prev,
                  }));
                }}
              >
                <div className='relative flex cursor-default select-none items-center'>
                  <Upload size={18} className='mr-2 text-gray-700' />
                  Subir comprobante
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                className='text-green-600'
                disabled={row.original.status === 'approved'}
                onClick={() => acceptPayment(row.original)}
              >
                <Check size={18} className='mr-2' />
                <span>Aceptar</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className='text-destructive'
                disabled={row.original.status === 'refused'}
                onClick={() => rejectPayment(row.original)}
              >
                <X size={18} className='mr-2' />
                <span>Rechazar</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
      <Toaster />
      <div className='w-full flex-1'>
        <div className='w-full max-w-md py-4 flex items-center gap-1'>
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
              <SelectGroup>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
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
        </div>
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
                <Label className='font-semibold'>Total a cobrar:</Label>{' '}
                {formatNumberToCurrency(recordDetails.total_amount ?? 0)}
              </span>
              <span className='font-light text-sm'>
                <Label className='font-semibold'>Pagado el día:</Label>{' '}
                {recordDetails.payment_date
                  ? dayjs(recordDetails.payment_date).format('DD/MM/YYYY')
                  : '-'}
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

      <Dialog open={uploadDialogOpen}>
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
              onClick={handleUploadFile}
              loading={isUploading}
            >
              Subir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};
