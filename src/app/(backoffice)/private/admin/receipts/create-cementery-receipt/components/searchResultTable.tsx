import { DataTableColumnHeader } from '@/components/data-table';
import { CustomDataTable } from '@/components/data-table/customDataTable';
import { cementery } from '@prisma/client';
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

interface SearchResultTableProps {
  data: cementery[];
  onSelect: (record: cementery) => void;
}

export const SearchResultTable = ({
  data,
  onSelect,
}: SearchResultTableProps) => {
  const columns: ColumnDef<cementery>[] = [
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
      <CustomDataTable<cementery>
        tableTitle='Registros de cementerio'
        columns={columns}
        table={table}
        onRecordClick={(record) => onSelect(record)}
      />
    </div>
  );
};
