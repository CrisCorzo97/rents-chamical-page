'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pagination } from '@/types/envelope';
import {
  ColumnDef,
  Table as TableType,
  flexRender,
} from '@tanstack/react-table';
import { Card, CardHeader, CardTitle } from '../ui/card';
import { TablePagination } from './tablePagination';

interface CustomDataTableProps<T> {
  tableTitle: string;
  columns: ColumnDef<T>[];
  table: TableType<T>;
  pagination?: Pagination;
  isFetching?: boolean;
  onRecordClick?: (record: T) => void;
  handlePagination?: (
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
  const {
    tableTitle,
    columns,
    table,
    pagination,
    isFetching,
    onRecordClick,
    handlePagination,
  } = props;

  return (
    <Card>
      <CardHeader className='p-4'>
        <CardTitle className='text-lg'>{tableTitle}</CardTitle>
      </CardHeader>

      {/* Desktop Table View */}
      <div className='hidden md:block rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className='text-sm md:text-base'>
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
            {isFetching ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center text-sm md:text-base'
                >
                  Cargando...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={() => onRecordClick?.(row.original)}
                  className='hover:bg-muted/50'
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className='p-2 text-sm md:text-base'
                    >
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
                  className='h-24 text-center text-sm md:text-base'
                >
                  Nada por aquí
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className='md:hidden space-y-4 p-4'>
        {isFetching ? (
          <div className='h-24 flex items-center justify-center text-sm'>
            Cargando...
          </div>
        ) : table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <Card
              key={row.id}
              onClick={() => onRecordClick?.(row.original)}
              className='hover:bg-muted/50 transition-colors border-none  shadow-none'
            >
              <div className='space-y-2'>
                {row.getVisibleCells().map((cell, index) => {
                  const header = table
                    .getHeaderGroups()
                    .flatMap((headerGroup) => headerGroup.headers)
                    .find((_, i) => i === index);

                  const headerValue = header
                    ? flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )
                    : '';

                  const value = flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  );

                  // Si el valor está vacío o es undefined, no mostramos la fila
                  if (!value) return null;

                  return (
                    <div
                      key={cell.id}
                      className='grid grid-cols-2 gap-2 py-1 last:border-b-2'
                    >
                      <div className='text-sm font-medium text-muted-foreground bg-muted/50 p-1 rounded'>
                        {headerValue}
                      </div>
                      <div className='text-sm flex justify-end'>{value}</div>
                    </div>
                  );
                })}
              </div>
            </Card>
          ))
        ) : (
          <div className='h-24 flex items-center justify-center text-sm'>
            Nada por aquí
          </div>
        )}
      </div>

      {pagination && handlePagination && (
        <div className='border-t'>
          <TablePagination
            pagination={pagination}
            handlePagination={handlePagination}
          />
        </div>
      )}
    </Card>
  );
}
