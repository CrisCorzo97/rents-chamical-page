import { DataTableColumnHeader } from '@/components/data-table';
import { CustomDataTable } from '@/components/data-table/customDataTable';
import { Button } from '@/components/ui';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { MousePointerClick } from 'lucide-react';
import { CementeryRecordWithRelations } from '../../../cementery/cementery.interface';

interface SearchResultTableProps {
  data: CementeryRecordWithRelations[];
  onSelect: (record: CementeryRecordWithRelations) => void;
}

export const SearchResultTable = ({
  data,
  onSelect,
}: SearchResultTableProps) => {
  const columns: ColumnDef<CementeryRecordWithRelations>[] = [
    {
      id: 'taxpayer',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='CONTRIBUYENTE' />
      ),
      accessorKey: 'taxpayer',
      enableSorting: false,
    },
    {
      id: 'address_taxpayer',
      accessorKey: 'address_taxpayer',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='DIRECCIÓN' />
      ),
      cell: ({ row }) => {
        const address_taxpayer = row.getValue('address_taxpayer');

        return address_taxpayer ? `${address_taxpayer}` : '-';
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
      <CustomDataTable<CementeryRecordWithRelations>
        tableTitle='Registros de cementerio'
        columns={columns}
        table={table}
        onRecordClick={() => {}}
      />
    </div>
  );
};
