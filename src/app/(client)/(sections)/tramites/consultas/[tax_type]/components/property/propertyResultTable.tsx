'use client';

import { PropertyRecordWithRelations } from '@/app/(backoffice)/private/admin/property/property.interface';
import { DataTableColumnHeader } from '@/components/data-table';
import { CustomDataTable } from '@/components/data-table/customDataTable';
import { Button } from '@/components/ui';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatName } from '@/lib/formatters';
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { MousePointerClick } from 'lucide-react';

interface PropertyResultTableProps {
  data: PropertyRecordWithRelations[];
  onSelect: (record: PropertyRecordWithRelations) => void;
}

const PropertyResultTable = ({ data, onSelect }: PropertyResultTableProps) => {
  const columns: ColumnDef<PropertyRecordWithRelations>[] = [
    {
      id: 'enrollment',
      accessorKey: 'enrollment',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='MATRÍCULA' />
      ),
      cell: ({ row }) => {
        const enrollment = row.getValue('enrollment');

        return enrollment ? `${enrollment}` : '-';
      },
      enableSorting: false,
    },
    {
      id: 'taxpayer',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='CONTRIBUYENTE' />
      ),
      accessorKey: 'taxpayer',
      enableSorting: false,
      cell: ({ row }) => formatName(row.original.taxpayer),
    },
    {
      id: 'address',
      accessorKey: 'address',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='DIRECCIÓN' />
      ),
      cell: ({ row }) => {
        const address = row.getValue('address');

        return address ? `${address}` : '-';
      },
      enableSorting: false,
    },
    {
      id: 'last_year_paid',
      accessorKey: 'last_year_paid',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='ÚLTIMO AÑO DE PAGO' />
      ),
      enableSorting: false,
    },
    {
      id: 'actions',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='' />
      ),
      cell: ({ row }) => {
        return (
          <TooltipProvider>
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <Button
                  variant='outline'
                  className='flex items-center gap-2'
                  size='icon'
                  onClick={() => onSelect(row.original)}
                >
                  <MousePointerClick size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent className='bg-black text-white'>
                <span>Seleccionar</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
      enableSorting: false,
    },
  ];

  const table = useReactTable({
    data,
    columns,
    manualSorting: true,
    manualPagination: true,
    manualFiltering: true,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <CustomDataTable<PropertyRecordWithRelations>
        tableTitle='Registros de inmuebles'
        columns={columns}
        table={table}
        onRecordClick={() => {}}
      />
    </div>
  );
};
export default PropertyResultTable;
