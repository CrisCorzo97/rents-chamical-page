'use client';
import { DataTableColumnHeader } from '@/components/custom-table';
import { DataTable } from '@/components/custom-table/data-table';
import { Card, CardContent } from '@/components/ui/card';
import { TableData } from '@/types/envelope';
import { declarable_tax, declarable_tax_period } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { formatName } from '@/lib/formatters';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import locale from 'dayjs/locale/es';

dayjs.locale(locale);
dayjs.extend(utc);

export const DueDateTable = ({
  items,
  pagination,
}: TableData<
  declarable_tax_period & {
    declarable_tax: declarable_tax;
  }
>) => {
  const columns: ColumnDef<
    declarable_tax_period & {
      declarable_tax: declarable_tax;
    }
  >[] = [
    {
      accessorKey: 'declarable_tax.tax_name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='TASA / CONTRIBUCIÓN' />
      ),
      cell: ({ row }) => formatName(row.original.declarable_tax.name),
      enableSorting: false,
    },
    {
      accessorKey: 'period',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='PERÍODO' />
      ),
      cell: ({ row }) =>
        formatName(dayjs(row.original.period).format('MMMM YYYY')),
      enableSorting: false,
    },
    {
      accessorKey: 'submission_due_date',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title='VENCIMIENTO PRESENTACIÓN'
        />
      ),
      cell: ({ row }) =>
        dayjs(row.original.submission_due_date).format('DD/MM/YYYY'),
      enableSorting: false,
    },
    {
      accessorKey: 'payment_due_date',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='VENCIMIENTO PAGO' />
      ),
      cell: ({ row }) =>
        dayjs(row.original.payment_due_date).format('DD/MM/YYYY'),
      enableSorting: false,
    },
  ];

  return (
    <Card className='md:col-span-12 xl:col-span-10 xl:col-start-1'>
      <CardContent>
        <DataTable
          tableTitle='Próximos Vencimientos'
          columns={columns}
          data={items}
          pagination={pagination}
        />
      </CardContent>
    </Card>
  );
};
