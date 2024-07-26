'use client';

import * as React from 'react';
import {
  ColumnDef,
  Table as TableType,
  flexRender,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pagination } from '@/types/envelope';
import { TablePagination } from './tablePagination';
import { Card, CardHeader, CardTitle } from '../card';

interface CustomDataTableProps<T> {
  tableTitle: string;
  columns: ColumnDef<T>[];
  table: TableType<T>;
  pagination: Pagination;
  handlePagination: (
    input: {
      page: number;
      limit: number;
    },
    options?: {
      getUrl: boolean;
    }
  ) => void | URL;
}

export function CustomDataTable<DataType>(
  props: CustomDataTableProps<DataType>
) {
  const { tableTitle, columns, table, pagination, handlePagination } = props;

  return (
    <Card>
      <CardHeader className='p-4'>
        <CardTitle className='text-lg'>{tableTitle}</CardTitle>
      </CardHeader>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <TablePagination
        pagination={pagination}
        handlePagination={handlePagination}
      />
    </Card>
  );
}
