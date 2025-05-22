'use client';

import { type Table } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { XIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DataTableViewOptions } from './data-table-view-options';
import { useEffect, useState, useCallback } from 'react';
import { useDebounceV2 } from '@/hooks/useDebounceV2';

// Definición para las columnas que se pueden filtrar
export interface FilterableColumn<TData> {
  id: Extract<keyof TData, string>; // El ID debe coincidir con una propiedad del objeto de datos TData
  title: string; // Título legible para el filtro en la UI
  options?: { label: string; value: string }[]; // Opciones para filtros de tipo 'select'
  type?: 'text' | 'select'; // Tipo de input que se renderizará para este filtro
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>; // Instancia de la tabla de react-table. Puede ser útil para funcionalidades futuras.
  tableTitle?: string;
  filterableColumns?: FilterableColumn<TData>[];
  activeFilters?: Record<string, string>; // Objeto con los filtros activos, ej: { status: "active", name: "John" }
  onFilterChange?: (filterId: string, value: string | null) => void; // Callback para notificar cambios en un filtro
}

// Componente interno para el input con debounce
interface DebouncedInputFilterProps<TData> {
  columnId: Extract<keyof TData, string>;
  columnTitle: string;
  initialValue: string;
  onCommitFilterChange: (
    columnId: Extract<keyof TData, string>,
    value: string | null
  ) => void;
}

function DebouncedInputFilter<TData>({
  columnId,
  columnTitle,
  initialValue,
  onCommitFilterChange,
}: DebouncedInputFilterProps<TData>) {
  const [inputValue, setInputValue] = useState<string>(initialValue);
  const debouncedInputValue = useDebounceV2(inputValue, 1500);

  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const cleanDebouncedValue =
      debouncedInputValue.trim() === '' ? null : debouncedInputValue.trim();
    const cleanInitialValue =
      initialValue.trim() === '' ? null : initialValue.trim();

    // Solo llamar a onCommitFilterChange si el valor debounced es realmente diferente
    // del valor que ya está "confirmado" (initialValue).
    if (cleanInitialValue !== cleanDebouncedValue) {
      onCommitFilterChange(columnId, cleanDebouncedValue);
    }
  }, [debouncedInputValue, initialValue, columnId, onCommitFilterChange]);

  const handleClearInput = () => {
    setInputValue('');
    // El useEffect anterior se encargará de llamar a onCommitFilterChange con null después del debounce.
  };

  return (
    <div className='relative flex items-center'>
      <Input
        id={columnId}
        placeholder={`${columnTitle}...`}
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        className='h-8 w-auto min-w-[150px] lg:w-[180px] pr-8' // Añadir padding a la derecha para el ícono
      />
      {inputValue && (
        <Button
          variant='ghost'
          size='icon'
          onClick={handleClearInput}
          className='absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-muted-foreground hover:text-foreground'
          aria-label={`Limpiar filtro para ${columnTitle}`}
        >
          <XIcon className='h-4 w-4' />
        </Button>
      )}
    </div>
  );
}

export function DataTableToolbar<TData>({
  table,
  tableTitle,
  filterableColumns = [],
  activeFilters = {},
  onFilterChange,
}: DataTableToolbarProps<TData>) {
  const handleSelectChange = (filterId: string, value: string) => {
    onFilterChange?.(filterId, value === 'ALL_VALUES' ? null : value);
  };

  const clearExternalFilter = (filterId: string) => {
    onFilterChange?.(filterId, null);
  };

  const commitTextFilterChange = useCallback(
    (filterId: string, value: string | null) => {
      onFilterChange?.(filterId, value);
    },
    [onFilterChange]
  );

  return (
    <div className='flex flex-col sm:flex-row items-start sm:items-center sm:justify-between py-4 space-y-2 sm:space-y-0'>
      <div className='flex-1'>
        {tableTitle && (
          <h2 className='text-xl font-semibold tracking-tight'>{tableTitle}</h2>
        )}
      </div>
      <div className='flex flex-wrap items-end gap-x-2 gap-y-3'>
        {filterableColumns.map((column) => {
          const currentFilterValue = activeFilters[column.id] || '';
          return (
            <div key={column.id} className='flex flex-col items-start gap-1'>
              {column.title && column.type === 'select' && (
                <label
                  htmlFor={column.id}
                  className='text-sm font-medium text-muted-foreground'
                >
                  {column.title}
                </label>
              )}
              <div className='flex items-center'>
                {column.type === 'select' && column.options ? (
                  <>
                    <Select
                      value={currentFilterValue || 'ALL_VALUES'}
                      onValueChange={(value) =>
                        handleSelectChange(column.id, value)
                      }
                    >
                      <SelectTrigger
                        id={column.id}
                        className='h-8 w-auto min-w-[120px]'
                      >
                        <SelectValue placeholder={column.title || `Todos`} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='ALL_VALUES'>Todos</SelectItem>
                        {column.options.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {currentFilterValue &&
                      currentFilterValue !== 'ALL_VALUES' && (
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() =>
                            handleSelectChange(column.id, 'ALL_VALUES')
                          }
                          className='h-8 w-8 p-0 ml-1 text-muted-foreground hover:text-foreground shrink-0'
                          aria-label={`Limpiar filtro para ${column.title}`}
                        >
                          <XIcon className='h-4 w-4' />
                        </Button>
                      )}
                  </>
                ) : (
                  <DebouncedInputFilter
                    columnId={column.id}
                    columnTitle={column.title}
                    initialValue={currentFilterValue}
                    onCommitFilterChange={commitTextFilterChange}
                  />
                )}
              </div>
            </div>
          );
        })}
        <div className='ml-auto flex items-center self-end pl-2'>
          <DataTableViewOptions table={table} />
        </div>
      </div>
    </div>
  );
}
