'use client';
import { DataTableColumnHeader } from '@/components/data-table/columnHeader';
import { CustomDataTable } from '@/components/data-table/customDataTable';
import { Button, Input } from '@/components/ui';
import { Toaster } from '@/components/ui/sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useFPS } from '@/hooks';
import { formatName } from '@/lib/formatters';
import { stateToSortBy } from '@/lib/table';
import { Envelope, Pagination } from '@/types/envelope';
import { registration_request, role } from '@prisma/client';
import {
  ColumnDef,
  getCoreRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import dayjs from 'dayjs';
import { CircleCheck, CircleX } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { confirmRequest, rejectRequest } from './actions.registration-request';

interface RegistrationRequestTableProps {
  data: Envelope<registration_request[]>;
  sorting: SortingState;
  filter: string;
  roles: role[];
}

export const RegistrationRequestTable = ({
  data,
  sorting,
  filter,
  roles,
}: RegistrationRequestTableProps) => {
  const [queryFilter, setQueryFilter] = useState<string>(filter);

  const { handleSort, handlePagination, handleFilter } = useFPS({
    pagination: data.pagination as Pagination,
  });

  const columns: ColumnDef<registration_request>[] = [
    {
      id: 'full_name',
      accessorKey: 'first_name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='NOMBRE Y APELLIDO' />
      ),
      enableSorting: true,
      cell: ({ row }) => {
        const first_name = formatName(row.original.first_name);
        const last_name = formatName(row.original.last_name);

        return `${first_name} ${last_name}`;
      },
    },
    {
      id: 'email',
      accessorKey: 'email',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='EMAIL' />
      ),
      enableSorting: true,
    },
    {
      id: 'cuil',
      accessorKey: 'cuil',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='CUIL' />
      ),
      enableSorting: false,
    },
    {
      id: 'role',
      accessorKey: 'role_id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='ROL SOLICITADO' />
      ),
      cell: ({ row }) => {
        const role_id = row.original.role_id;

        return roles.find((role) => role.id === role_id)?.role ?? '';
      },
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

        return status === 'pending' ? (
          <span className='bg-yellow-100 py-2 px-3 rounded-sm text-yellow-600'>
            Pendiente
          </span>
        ) : status === 'approved' ? (
          <span className='bg-green-100 py-2 px-3 rounded-sm text-green-500'>
            Aprobado
          </span>
        ) : (
          <span className='bg-red-100 py-2 px-3 rounded-sm text-red-500'>
            Rechazado
          </span>
        );
      },
      enableSorting: false,
    },
    {
      id: 'created_at',
      accessorKey: 'created_at',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='FECHA DE SOLICITUD' />
      ),
      cell: ({ row }) => {
        const created_at = row.original.created_at;

        return dayjs(created_at).format('DD/MM/YYYY HH:mm');
      },
      enableSorting: false,
    },
    {
      id: 'actions',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='' />
      ),
      cell: ({ row }) => {
        return (
          <div className='flex items-center gap-2'>
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <Button
                    variant='outline'
                    className='flex items-center gap-2'
                    size='icon'
                    onClick={() =>
                      rejectRequest(row.original)
                        .then(() =>
                          toast.success('Solicitud rechazada correctamente.')
                        )
                        .catch(() =>
                          toast.error('Hubo un error al rechazar la solicitud.')
                        )
                    }
                  >
                    <CircleX size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className='bg-black text-white'>
                  <span>Denegar</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <Button
                    variant='default'
                    className='flex items-center gap-2'
                    size='icon'
                    onClick={() =>
                      confirmRequest(row.original)
                        .then(() =>
                          toast.success('Solicitud aprobada correctamente.')
                        )
                        .catch(() =>
                          toast.error('Hubo un error al aprobar la solicitud.')
                        )
                    }
                  >
                    <CircleCheck size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className='bg-black text-white'>
                  <span>Aprobar</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
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
        <div className='flex py-4'>
          <Input
            placeholder='Filtrar por primer nombre'
            value={queryFilter}
            onChange={(event) => setQueryFilter(event.target.value)}
            className='max-w-sm'
          />
        </div>

        <CustomDataTable<registration_request>
          tableTitle='Solicitudes de registro'
          columns={columns}
          table={table}
          pagination={data.pagination as Pagination}
          onRecordClick={() => {}}
          handlePagination={handlePagination}
        />
      </div>
    </section>
  );
};
