'use client';
import { Button, Input, Label } from '@/components/ui';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DataTableColumnHeader } from '@/components/ui/data-table';
import { CustomDataTable } from '@/components/ui/data-table/customDataTable';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { useCallbackDebouncing } from '@/hooks';
import { useFPS } from '@/hooks/useFPS';
import { cn } from '@/lib/cn';
import { stateToSortBy } from '@/lib/table';
import { Envelope, Pagination } from '@/types/envelope';
import { cementery } from '@prisma/client';
import {
  ColumnDef,
  getCoreRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import clsx from 'clsx';
import { CirclePlus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { CementeryRecordWithRelations } from '../cementery/cementery.interface';
import { ConfirmModal } from './components';

const MISSING_FIELDS: Record<string, string> = {
  address_taxpayer: 'Dirección',
};

interface ReceiptClientPageProps {
  data: Envelope<cementery[]>;
  sorting: SortingState;
  filter: string;
}

export const ReceiptClientPage = ({
  data,
  filter,
  sorting,
}: ReceiptClientPageProps) => {
  const [queryFilter, setQueryFilter] = useState<string>(filter);
  const [recordDetails, setRecordDetails] =
    useState<CementeryRecordWithRelations | null>(null);

  const { handleSort, handlePagination, handleFilter } = useFPS({
    pagination: data.pagination as Pagination,
  });

  const columns: ColumnDef<cementery>[] = [
    {
      id: 'taxpayer',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='CONTRIBUYENTE' />
      ),
      accessorKey: 'taxpayer',
      enableColumnFilter: true,
    },
    {
      id: 'address_taxpayer',
      accessorKey: 'address_taxpayer',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='DIRECCIÓN' />
      ),
      cell: ({ row }) => {
        const address = row.getValue('address_taxpayer');

        return address ? `${address}` : '-';
      },
      enableSorting: false,
    },
    {
      id: 'deceased_name',
      accessorKey: 'deceased_name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='NOMBRE DIFUNTO' />
      ),
      cell: ({ row }) => {
        const deceased_name = row.getValue('deceased_name');

        return deceased_name ? `${deceased_name}` : '-';
      },
      enableSorting: true,
    },
    {
      id: 'last_year_paid',
      accessorKey: 'last_year_paid',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='ÚLTIMO AÑO PAGO' />
      ),
      sortDescFirst: false,
    },
    {
      id: 'missing_fields',
      accessorKey: 'missing_fields',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='CAMPOS FALTANTES' />
      ),
      cell: ({ row }) => {
        let missing_fields: string[] | null = null;
        let value = row.getValue('missing_fields') as string | null;

        if (value) {
          const array = JSON.parse(value) as string[];

          missing_fields = array.map(
            (field: string) => MISSING_FIELDS[field] ?? field
          );
        }

        return missing_fields ? missing_fields.join(', ') : '-';
      },
      enableSorting: true,
    },
  ];

  useCallbackDebouncing({
    value: queryFilter,
    delay: 1500,
    callback: () => {
      if (queryFilter !== filter) {
        handleFilter({
          filter: queryFilter,
        });
      }
    },
  });

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
        <Card className='mt-6 flex flex-col items-center justify-center border-dashed bg-neutral-100'>
          <CardHeader>
            <CardTitle className='text-lg font-semibold'>
              Acciones rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className='flex gap-2 mt-4'>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button size='lg' className='flex gap-2'>
                  <CirclePlus size={18} />
                  Crear
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-full'>
                <DropdownMenuItem>
                  <Link
                    href='/private/admin/receipts/create-cementery-receipt'
                    prefetch
                    className='w-full'
                  >
                    Cementerio
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href='/private/admin/receipts/create-driver-license-receipt'
                    prefetch
                    className='w-full'
                  >
                    Licencia de conducir
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href='/private/admin/receipts/create-property-receipt'
                    prefetch
                    className='w-full'
                  >
                    Inmueble
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href='/private/admin/receipts/create-various-rates-receipt'
                    prefetch
                    className='w-full'
                  >
                    Tasas diversas
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <ConfirmModal />
          </CardContent>
        </Card>

        <div className='flex items-center justify-between mb-4 mt-6'>
          <Input
            placeholder='Filtrar por contribuyente'
            value={queryFilter}
            onChange={(event) => setQueryFilter(event.target.value)}
            className='max-w-sm'
          />
        </div>
        <CustomDataTable<cementery>
          tableTitle='Historial de comprobantes'
          columns={columns}
          table={table}
          pagination={data.pagination as Pagination}
          handlePagination={handlePagination}
          onRecordClick={(record) => {
            if (recordDetails?.id !== (record as cementery).id) {
              setRecordDetails(record as CementeryRecordWithRelations);
            } else {
              setRecordDetails(null);
            }
          }}
        />
      </div>

      <Card
        className={cn(
          `w-full max-w-96 mt-[4.5rem] bg-rose-100 transition-all duration-300`,
          clsx({
            'w-0 border-none': !recordDetails,
          })
        )}
      >
        {recordDetails && (
          <>
            <CardHeader>
              <CardTitle className='text-lg font-semibold'>
                Detalles del registro
              </CardTitle>
              <CardDescription>
                <strong>ID:</strong> {recordDetails.id}
              </CardDescription>
            </CardHeader>

            <Separator className='mb-4 w-[90%] mx-auto' />

            <CardContent className='flex flex-col gap-2'>
              <span className='font-light text-sm'>
                <Label className='font-semibold'>Contribuyente:</Label>{' '}
                {recordDetails.taxpayer ?? '-'}
              </span>
              <span className='font-light text-sm'>
                <Label className='font-semibold'>Dirección:</Label>{' '}
                {recordDetails.address_taxpayer ?? '-'}
              </span>
              <span className='font-light text-sm'>
                <Label className='font-semibold'>Barrio:</Label>{' '}
                {recordDetails.neighborhood?.name ?? '-'}
              </span>
              <span className='font-light text-sm'>
                <Label className='font-semibold'>Cementerio:</Label>{' '}
                {recordDetails.cementery_place?.name ?? '-'}
              </span>
              <span className='font-light text-sm'>
                <Label className='font-semibold'>Tipo de entierro:</Label>{' '}
                {recordDetails.burial_type?.type ?? '-'}
              </span>
              <span className='font-light text-sm'>
                <Label className='font-semibold'>Sección:</Label>{' '}
                {recordDetails.section ?? '-'}
              </span>
              <span className='font-light text-sm'>
                <Label className='font-semibold'>Fila:</Label>{' '}
                {recordDetails.row ?? '-'}
              </span>
              <span className='font-light text-sm'>
                <Label className='font-semibold'>Nro de localización:</Label>{' '}
                {recordDetails.location_number ?? '-'}
              </span>
              <span className='font-light text-sm'>
                <Label className='font-semibold'>Nombre del difunto:</Label>{' '}
                {`${recordDetails.deceased_name}` ?? '-'}
              </span>
              <span className='font-light text-sm'>
                <Label className='font-semibold'>Último año abonado:</Label>{' '}
                {`${recordDetails.last_year_paid}` ?? '-'}
              </span>
              <span className='font-light text-sm'>
                <Label className='font-semibold'>Campos faltantes:</Label>{' '}
                {recordDetails.missing_fields
                  ? JSON.parse(recordDetails.missing_fields)
                      .map((field: string) => MISSING_FIELDS[field] ?? field)
                      .join('')
                  : '-'}
              </span>
            </CardContent>
          </>
        )}
      </Card>
    </section>
  );
};
