'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// ============================================================================
// TIPOS Y CONFIGURACIONES
// ============================================================================

interface DateRangePickerProps {
  startDate?: Date;
  endDate?: Date;
  onDateChange?: (startDate: Date, endDate: Date) => void;
  onApply?: () => void;
  onReset?: () => void;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}

interface PresetOption {
  label: string;
  value: string;
  getDates: () => { start: Date; end: Date };
}

// ============================================================================
// OPCIONES PREDEFINIDAS
// ============================================================================

const PRESET_OPTIONS: PresetOption[] = [
  {
    label: 'Hoy',
    value: 'today',
    getDates: () => {
      const today = new Date();
      return { start: today, end: today };
    },
  },
  {
    label: 'Ayer',
    value: 'yesterday',
    getDates: () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return { start: yesterday, end: yesterday };
    },
  },
  {
    label: 'Últimos 7 días',
    value: 'last7days',
    getDates: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 6);
      return { start, end };
    },
  },
  {
    label: 'Últimos 30 días',
    value: 'last30days',
    getDates: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 29);
      return { start, end };
    },
  },
  {
    label: 'Este mes',
    value: 'thisMonth',
    getDates: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date();
      return { start, end };
    },
  },
  {
    label: 'Mes anterior',
    value: 'lastMonth',
    getDates: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0);
      return { start, end };
    },
  },
  {
    label: 'Últimos 3 meses',
    value: 'last3months',
    getDates: () => {
      const end = new Date();
      const start = new Date();
      start.setMonth(start.getMonth() - 3);
      return { start, end };
    },
  },
  {
    label: 'Últimos 6 meses',
    value: 'last6months',
    getDates: () => {
      const end = new Date();
      const start = new Date();
      start.setMonth(start.getMonth() - 6);
      return { start, end };
    },
  },
  {
    label: 'Este año',
    value: 'thisYear',
    getDates: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), 0, 1);
      const end = new Date();
      return { start, end };
    },
  },
  {
    label: 'Año anterior',
    value: 'lastYear',
    getDates: () => {
      const now = new Date();
      const start = new Date(now.getFullYear() - 1, 0, 1);
      const end = new Date(now.getFullYear() - 1, 11, 31);
      return { start, end };
    },
  },
];

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export function DateRangePicker({
  startDate,
  endDate,
  onDateChange,
  onApply,
  onReset,
  className,
  disabled = false,
  loading = false,
}: DateRangePickerProps) {
  const [selectedStartDate, setSelectedStartDate] = React.useState<
    Date | undefined
  >(startDate);
  const [selectedEndDate, setSelectedEndDate] = React.useState<
    Date | undefined
  >(endDate);
  const [isOpen, setIsOpen] = React.useState(false);

  // Actualizar fechas cuando cambian las props
  React.useEffect(() => {
    setSelectedStartDate(startDate);
    setSelectedEndDate(endDate);
  }, [startDate, endDate]);

  // Función para aplicar fechas
  const handleApply = React.useCallback(() => {
    if (selectedStartDate && selectedEndDate && onDateChange) {
      onDateChange(selectedStartDate, selectedEndDate);
    }
    if (onApply) {
      onApply();
    }
    setIsOpen(false);
  }, [selectedStartDate, selectedEndDate, onDateChange, onApply]);

  // Función para resetear fechas
  const handleReset = React.useCallback(() => {
    const defaultDates = PRESET_OPTIONS[3].getDates(); // Últimos 30 días por defecto
    setSelectedStartDate(defaultDates.start);
    setSelectedEndDate(defaultDates.end);

    if (onDateChange) {
      onDateChange(defaultDates.start, defaultDates.end);
    }
    if (onReset) {
      onReset();
    }
  }, [onDateChange, onReset]);

  // Función para aplicar preset
  const handlePresetSelect = React.useCallback((preset: PresetOption) => {
    const dates = preset.getDates();
    setSelectedStartDate(dates.start);
    setSelectedEndDate(dates.end);
  }, []);

  // Función para navegar entre meses
  const handleMonthChange = React.useCallback(
    (direction: 'prev' | 'next') => {
      if (!selectedStartDate) return;

      const newStart = new Date(selectedStartDate);
      if (direction === 'prev') {
        newStart.setMonth(newStart.getMonth() - 1);
      } else {
        newStart.setMonth(newStart.getMonth() + 1);
      }

      const newEnd = new Date(newStart);
      newEnd.setMonth(newEnd.getMonth() + 1);
      newEnd.setDate(newEnd.getDate() - 1);

      setSelectedStartDate(newStart);
      setSelectedEndDate(newEnd);
    },
    [selectedStartDate]
  );

  // Formatear fechas para mostrar
  const formatDateRange = () => {
    if (!selectedStartDate || !selectedEndDate) {
      return 'Seleccionar fechas';
    }

    if (selectedStartDate.toDateString() === selectedEndDate.toDateString()) {
      return format(selectedStartDate, 'PPP', { locale: es });
    }

    return `${format(selectedStartDate, 'PP', { locale: es })} - ${format(selectedEndDate, 'PP', { locale: es })}`;
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Selector de Fechas */}
      <div className='flex items-center space-x-2'>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              className={cn(
                'justify-start text-left font-normal',
                !selectedStartDate && 'text-muted-foreground'
              )}
              disabled={disabled}
            >
              <CalendarIcon className='mr-2 h-4 w-4' />
              {formatDateRange()}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0' align='start'>
            <div className='flex'>
              {/* Panel de Presets */}
              <div className='border-r p-3'>
                <h4 className='font-medium text-sm mb-3'>
                  Períodos Predefinidos
                </h4>
                <div className='space-y-1'>
                  {PRESET_OPTIONS.map((preset) => (
                    <Button
                      key={preset.value}
                      variant='ghost'
                      size='sm'
                      className='w-full justify-start text-xs'
                      onClick={() => handlePresetSelect(preset)}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Calendario */}
              <div className='p-3'>
                <div className='flex items-center justify-between mb-3'>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => handleMonthChange('prev')}
                  >
                    <ChevronLeft className='h-4 w-4' />
                  </Button>
                  <span className='text-sm font-medium'>
                    {selectedStartDate &&
                      format(selectedStartDate, 'MMMM yyyy', { locale: es })}
                  </span>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => handleMonthChange('next')}
                  >
                    <ChevronRight className='h-4 w-4' />
                  </Button>
                </div>

                <Calendar
                  mode='range'
                  selected={{
                    from: selectedStartDate,
                    to: selectedEndDate,
                  }}
                  onSelect={(range) => {
                    setSelectedStartDate(range?.from);
                    setSelectedEndDate(range?.to);
                  }}
                  numberOfMonths={1}
                  locale={es}
                />
              </div>
            </div>

            {/* Botones de Acción */}
            <div className='flex items-center justify-between p-3 border-t'>
              <Button variant='ghost' size='sm' onClick={handleReset}>
                Resetear
              </Button>
              <div className='flex items-center space-x-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setIsOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  size='sm'
                  onClick={handleApply}
                  disabled={!selectedStartDate || !selectedEndDate || loading}
                >
                  {loading ? (
                    <RefreshCw className='h-4 w-4 animate-spin' />
                  ) : (
                    'Aplicar'
                  )}
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Botón de Aplicar */}
        <Button
          onClick={handleApply}
          disabled={
            !selectedStartDate || !selectedEndDate || disabled || loading
          }
          size='sm'
        >
          {loading ? (
            <RefreshCw className='h-4 w-4 animate-spin' />
          ) : (
            <>
              <Filter className='h-4 w-4 mr-2' />
              Aplicar
            </>
          )}
        </Button>
      </div>

      {/* Información del Período */}
      {selectedStartDate && selectedEndDate && (
        <div className='text-xs text-muted-foreground'>
          <span>
            Período seleccionado:{' '}
            {format(selectedStartDate, 'PP', { locale: es })} -{' '}
            {format(selectedEndDate, 'PP', { locale: es })}
          </span>
          <span className='ml-2'>
            (
            {Math.ceil(
              (selectedEndDate.getTime() - selectedStartDate.getTime()) /
                (1000 * 60 * 60 * 24)
            )}{' '}
            días)
          </span>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// COMPONENTE CON CONFIGURACIÓN POR DEFECTO
// ============================================================================

export function DateRangePickerDefault() {
  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();

  React.useEffect(() => {
    // Establecer fechas por defecto (últimos 30 días)
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 29);
    setStartDate(start);
    setEndDate(end);
  }, []);

  const handleDateChange = React.useCallback((start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
    console.log('Date range changed:', { start, end });
  }, []);

  return (
    <DateRangePicker
      startDate={startDate}
      endDate={endDate}
      onDateChange={handleDateChange}
    />
  );
}
