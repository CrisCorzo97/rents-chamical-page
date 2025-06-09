'use client';

import { DataTableColumnHeader } from '@/components/custom-table';
import { ColumnDef } from '@tanstack/react-table';

type DueDateRow = {
  id: string;
  tax_name: string;
  period: string;
  due_date: string;
};

export const columns: ColumnDef<DueDateRow>[] = [
  {
    accessorKey: 'tax_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='TASA / CONTRIBUCIÓN' />
    ),
  },
  {
    accessorKey: 'period',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='PERÍODO' />
    ),
  },
  {
    accessorKey: 'due_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='VENCIMIENTO' />
    ),
  },
];
