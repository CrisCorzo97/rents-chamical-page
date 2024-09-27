import { DataTableColumnHeader } from '@/components/data-table';
import { CustomDataTable } from '@/components/data-table/customDataTable';
import { property } from '@prisma/client';
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

interface SearchResultTableProps {
  data: property[];
  onSelect: (record: property) => void;
}

export const SearchResultTable = ({
  data,
  onSelect,
}: SearchResultTableProps) => {
  const columns: ColumnDef<property>[] = [
    {
      id: 'taxpayer',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='CONTRIBUYENTE' />
      ),
      accessorKey: 'taxpayer',
      enableColumnFilter: true,
    },
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
      sortDescFirst: false,
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
      <CustomDataTable<property>
        tableTitle='Registros de inmuebles'
        columns={columns}
        table={table}
        onRecordClick={(record) => onSelect(record)}
      />
    </div>
  );
};
