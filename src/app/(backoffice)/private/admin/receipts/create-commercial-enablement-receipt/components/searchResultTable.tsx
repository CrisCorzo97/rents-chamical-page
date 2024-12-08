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
import { CommercialEnablementWithRelations } from '../../../commercial_enablement/commercial_enablement.interface';

interface SearchResultTableProps {
  data: CommercialEnablementWithRelations[];
  onSelect: (record: CommercialEnablementWithRelations) => void;
}

export const SearchResultTable = ({
  data,
  onSelect,
}: SearchResultTableProps) => {
  const columns: ColumnDef<CommercialEnablementWithRelations>[] = [
    {
      id: 'taxpayer',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='CONTRIBUYENTE' />
      ),
      accessorKey: 'taxpayer',
      enableSorting: false,
      cell: ({ row }) => formatName(row.original?.taxpayer ?? ''),
    },
    {
      id: 'company_name',
      accessorKey: 'company_name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='RAZÓN SOCIAL' />
      ),
      cell: ({ row }) => formatName(row.original?.company_name ?? '') ?? '-',
      enableSorting: false,
    },
    {
      id: 'commercial_activity_id',
      accessorKey: 'commercial_activity',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='RUBRO' />
      ),
      cell: ({ row }) => row.original?.commercial_activity?.activity ?? '-',
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
      <CustomDataTable<CommercialEnablementWithRelations>
        tableTitle='Registros de habilitación comercial'
        columns={columns}
        table={table}
        onRecordClick={() => {}}
      />
    </div>
  );
};
