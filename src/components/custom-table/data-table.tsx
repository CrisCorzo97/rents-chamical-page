import { useState } from 'react';
import React from 'react';
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/custom-table/table';
import { DataTablePagination } from './data-table-pagination';
import { DataTableToolbar } from './data-table-toolbar';
import { type Pagination } from '@/types/envelope';

// Definición preliminar de cómo podrían ser los filtros
export type DataTableFilter = {
  id: string;
  value: string | string[]; // Permite valor único o múltiple para filtros como "in list"
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  tableTitle?: string;
  searchableColumns?: {
    id: string;
    title: string;
  }[];
  filterableColumns?: {
    id: Extract<keyof TData, string>;
    title: string;
    options?: {
      label: string;
      value: string;
    }[];
    type?: 'text' | 'select' | 'date'; // Para ayudar a DataTableToolbar a renderizar el input adecuado
  }[];
  pagination?: Pagination | null;
  searchParams?: {
    page?: string;
    limit?: string;
    sort_by?: string;
    sort_direction?: string;
    filters?: Record<string, string>; // e.g. { "status": "active", "name": "john" }
  };
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  onSortingChange?: (sortBy: string, sortDirection: 'asc' | 'desc') => void;
  onFilterChange?: (filterId: string, value: string | null) => void;
  expandedRows?: Set<string | number>;
  expandedSubTableColumns?: { id: string; title: string }[];
  renderExpandedSubRows?: (rowData: TData) => React.ReactNode;
  renderExpandedRow?: (rowData: TData) => React.ReactNode;
  getRowId?: (rowData: TData) => string | number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  tableTitle,
  filterableColumns,
  pagination,
  searchParams,
  onPageChange,
  onLimitChange,
  onSortingChange,
  onFilterChange,
  expandedRows,
  expandedSubTableColumns,
  renderExpandedSubRows,
  renderExpandedRow,
  getRowId,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>(() => {
    if (searchParams?.sort_by && searchParams?.sort_direction) {
      return [
        {
          id: searchParams.sort_by,
          desc: searchParams.sort_direction === 'desc',
        },
      ];
    }
    return [];
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === 'function' ? updater(sorting) : updater;
      setSorting(newSorting);
      if (newSorting.length > 0 && onSortingChange) {
        onSortingChange(newSorting[0].id, newSorting[0].desc ? 'desc' : 'asc');
      } else if (newSorting.length === 0 && onSortingChange) {
        onSortingChange('', 'asc');
      }
    },
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    manualPagination: !!pagination,
    manualSorting: !!onSortingChange,
    manualFiltering: !!onFilterChange,
  });

  return (
    <div className='space-y-4'>
      <DataTableToolbar
        table={table}
        tableTitle={tableTitle}
        filterableColumns={filterableColumns as any}
        activeFilters={searchParams?.filters}
        onFilterChange={onFilterChange}
      />
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className='font-semibold text-gray-600'
                    >
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
              table.getRowModel().rows.map((row) => {
                const rowId = getRowId
                  ? getRowId(row.original)
                  : (row.original as any)?.id ?? row.id;
                const isExpanded =
                  expandedRows && rowId && expandedRows.has(rowId);
                return (
                  <React.Fragment key={row.id}>
                    <TableRow data-state={row.getIsSelected() && 'selected'}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                    {isExpanded &&
                      renderExpandedRow &&
                      !renderExpandedSubRows && (
                        <TableRow className='bg-muted/40'>
                          <TableCell
                            colSpan={row.getVisibleCells().length}
                            className='p-4'
                          >
                            {renderExpandedRow(row.original)}
                          </TableCell>
                        </TableRow>
                      )}
                    {isExpanded &&
                      renderExpandedSubRows &&
                      expandedSubTableColumns && (
                        <TableRow className='bg-muted/40'>
                          <TableCell
                            colSpan={row.getVisibleCells().length}
                            className='p-4'
                          >
                            <div className='rounded-md border bg-background'>
                              <Table className='min-w-full text-sm'>
                                <TableHeader>
                                  <TableRow>
                                    {expandedSubTableColumns.map((col) => (
                                      <TableHead
                                        key={col.id}
                                        className='px-4 py-2 text-left font-semibold'
                                      >
                                        {col.title}
                                      </TableHead>
                                    ))}
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {(() => {
                                    const subRows = renderExpandedSubRows(
                                      row.original
                                    );
                                    if (!Array.isArray(subRows)) return null;

                                    return subRows.map(
                                      (rowData: any[], idx: number) => (
                                        <TableRow
                                          key={`${row.id}-subrow-${idx}`}
                                          className='border-t'
                                        >
                                          {rowData.map((cell, cidx) => (
                                            <TableCell
                                              key={`${row.id}-cell-${cidx}`}
                                              className='px-4 py-2'
                                            >
                                              {cell}
                                            </TableCell>
                                          ))}
                                        </TableRow>
                                      )
                                    );
                                  })()}
                                </TableBody>
                              </Table>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                  </React.Fragment>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {pagination && (
        <DataTablePagination
          pagination={pagination}
          onPageChange={onPageChange}
          currentLimit={
            searchParams?.limit ? parseInt(searchParams.limit) : undefined
          }
          onLimitChange={onLimitChange}
        />
      )}
    </div>
  );
}
