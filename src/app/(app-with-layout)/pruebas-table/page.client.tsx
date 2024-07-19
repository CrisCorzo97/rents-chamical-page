'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { property } from '@prisma/client';
import { Envelope } from '@/types/envelope';
import { CustomColumnDef } from './page';
import { CustomDataTable } from '@/components/ui/data-table/customDataTable';

export type Payment = {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
};

export const columns: ColumnDef<property>[] = [
  {
    id: 'id',
    header: 'ID',
    accessorKey: 'id',
  },
  {
    id: 'taxpayer',
    header: 'CONTRIBUYENTE',
    accessorKey: 'taxpayer',
  },
  {
    id: 'address',
    accessorKey: 'address',
    header: 'DIRECCIÓN',
  },
  {
    id: 'enrollment',
    accessorKey: 'enrollment',
    header: 'MATRÍCULA',
    cell: ({ row }) => {
      const enrollment = row.getValue('enrollment');

      return enrollment ? `${enrollment}` : '-';
    },
  },
  {
    id: 'is_part',
    accessorKey: 'is_part',
    header: 'ES PARTE',
    cell: ({ row }) => {
      const is_part = row.getValue('is_part');

      return is_part ? 'Sí' : 'No';
    },
  },
  {
    id: 'last_year_paid',
    accessorKey: 'last_year_paid',
    header: 'ÚLTIMO PAGO',
  },
];

interface DataTableDemoProps<T> {
  data: Envelope<T[]>;
}

export function DataTableDemo<DataType>(props: DataTableDemoProps<DataType>) {
  const columns: ColumnDef<DataType>[] = [
    {
      id: 'id',
      header: 'ID',
      accessorKey: 'id',
      enableSorting: false,
    },
    {
      id: 'taxpayer',
      header: 'CONTRIBUYENTE',
      accessorKey: 'taxpayer',
    },
    {
      id: 'address',
      accessorKey: 'address',
      header: 'DIRECCIÓN',
      cell: ({ row }) => {
        const address = row.getValue('address');

        return address ? `${address}` : '-';
      },
    },
    {
      id: 'enrollment',
      accessorKey: 'enrollment',
      header: 'MATRÍCULA',
      cell: ({ row }) => {
        const enrollment = row.getValue('enrollment');

        return enrollment ? `${enrollment}` : '-';
      },
    },
    {
      id: 'is_part',
      accessorKey: 'is_part',
      header: 'ES PARTE',
      cell: ({ row }) => {
        const is_part = row.getValue('is_part');

        return is_part ? 'Sí' : 'No';
      },
    },
    {
      id: 'last_year_paid',
      accessorKey: 'last_year_paid',
      header: 'ÚLTIMO PAGO',
    },
  ];

  return <CustomDataTable<DataType> data={props.data} columns={columns} />;
}
