'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from 'recharts';
import {
  RefreshCw,
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  Calendar,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { formatNumberToCurrency } from '@/lib/formatters';
import { DailyCashFlowData } from '../../types/dashboard.types';
import { ChartSkeleton } from '../ui/chart-skeleton';
import { ErrorBoundary, ChartErrorFallback } from '../ui/error-boundary';
import { getDailyCashFlow } from '../../services/revenue-data.service';

// ============================================================================
// TIPOS Y CONFIGURACIONES
// ============================================================================

interface CashFlowChartProps {
  data?: DailyCashFlowData[];
  loading?: boolean;
  error?: string;
  onRefresh?: () => void;
  className?: string;
  height?: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

// ============================================================================
// COMPONENTE DE TOOLTIP PERSONALIZADO
// ============================================================================

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload as DailyCashFlowData;

    return (
      <div className='bg-background border border-border rounded-lg shadow-lg p-3'>
        <p className='font-medium text-sm'>{label}</p>
        <div className='space-y-1 mt-2'>
          <div className='flex items-center justify-between'>
            <span className='text-xs text-muted-foreground'>Ingresos:</span>
            <span className='text-sm font-semibold text-green-600'>
              {formatNumberToCurrency(data.income)}
            </span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-xs text-muted-foreground'>Egresos:</span>
            <span className='text-sm font-semibold text-red-600'>
              {formatNumberToCurrency(data.expenses)}
            </span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-xs text-muted-foreground'>Flujo Neto:</span>
            <span
              className={cn(
                'text-sm font-semibold',
                data.netFlow >= 0 ? 'text-green-600' : 'text-red-600'
              )}
            >
              {formatNumberToCurrency(data.netFlow)}
            </span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-xs text-muted-foreground'>Acumulado:</span>
            <span
              className={cn(
                'text-sm font-semibold',
                data.cumulativeFlow >= 0 ? 'text-blue-600' : 'text-orange-600'
              )}
            >
              {formatNumberToCurrency(data.cumulativeFlow)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export function CashFlowChart({
  data,
  loading = false,
  error,
  onRefresh,
  className,
  height = 400,
}: CashFlowChartProps) {
  if (loading) {
    return <ChartSkeleton title='Flujo de Caja Diario' height={height} />;
  }

  if (error) {
    return (
      <Card className={cn('border-destructive/20', className)}>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium text-destructive'>
            Flujo de Caja Diario
          </CardTitle>
          <AlertTriangle className='h-4 w-4 text-destructive' />
        </CardHeader>
        <CardContent className='flex flex-col items-center justify-center py-8'>
          <AlertTriangle className='h-8 w-8 text-destructive mb-4' />
          <h3 className='text-lg font-semibold text-destructive mb-2'>
            Error al cargar datos
          </h3>
          <p className='text-sm text-muted-foreground text-center mb-4'>
            {error}
          </p>
          {onRefresh && (
            <Button onClick={onRefresh} variant='outline' size='sm'>
              <RefreshCw className='h-4 w-4 mr-2' />
              Reintentar
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className={cn('border-border', className)}>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>
            Flujo de Caja Diario
          </CardTitle>
          <Calendar className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent className='flex flex-col items-center justify-center py-8'>
          <DollarSign className='h-8 w-8 text-muted-foreground mb-4' />
          <h3 className='text-lg font-semibold mb-2'>Sin datos disponibles</h3>
          <p className='text-sm text-muted-foreground text-center'>
            No hay datos de flujo de caja para mostrar en el período
            seleccionado.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calcular estadísticas
  const totalIncome = data.reduce((sum, item) => sum + item.income, 0);
  const totalExpenses = data.reduce((sum, item) => sum + item.expenses, 0);
  const netFlow = totalIncome - totalExpenses;
  const avgDailyFlow =
    data.reduce((sum, item) => sum + item.netFlow, 0) / data.length;

  // Calcular tendencia
  const firstValue = data[0]?.cumulativeFlow || 0;
  const lastValue = data[data.length - 1]?.cumulativeFlow || 0;
  const trendPercentage =
    firstValue > 0 ? ((lastValue - firstValue) / firstValue) * 100 : 0;
  const isTrendPositive = trendPercentage >= 0;

  // Encontrar días con mejor y peor flujo
  const bestDay = data.reduce((best, current) =>
    current.netFlow > best.netFlow ? current : best
  );
  const worstDay = data.reduce((worst, current) =>
    current.netFlow < worst.netFlow ? current : worst
  );

  return (
    <Card className={cn('border-border', className)}>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <div className='space-y-1'>
          <CardTitle className='text-sm font-medium'>
            Flujo de Caja Diario
          </CardTitle>
          <div className='flex items-center space-x-4'>
            <span className='text-xs text-muted-foreground'>
              Ingresos: {formatNumberToCurrency(totalIncome)}
            </span>
            <span className='text-xs text-muted-foreground'>•</span>
            <span className='text-xs text-muted-foreground'>
              Egresos: {formatNumberToCurrency(totalExpenses)}
            </span>
            <span className='text-xs text-muted-foreground'>•</span>
            <span
              className={cn(
                'text-xs font-medium',
                netFlow >= 0 ? 'text-green-600' : 'text-red-600'
              )}
            >
              Neto: {formatNumberToCurrency(netFlow)}
            </span>
          </div>
        </div>
        <div className='flex items-center space-x-2'>
          {isTrendPositive ? (
            <TrendingUp className='h-4 w-4 text-green-600' />
          ) : (
            <TrendingDown className='h-4 w-4 text-red-600' />
          )}
          <span
            className={cn(
              'text-xs font-medium',
              isTrendPositive ? 'text-green-600' : 'text-red-600'
            )}
          >
            {isTrendPositive ? '+' : ''}
            {trendPercentage.toFixed(1)}%
          </span>
        </div>
      </CardHeader>

      <CardContent>
        <div className='h-[400px] w-full'>
          <ResponsiveContainer width='100%' height='100%'>
            <ComposedChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <defs>
                <linearGradient id='incomeGradient' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='#10b981' stopOpacity={0.3} />
                  <stop offset='95%' stopColor='#10b981' stopOpacity={0.05} />
                </linearGradient>
                <linearGradient
                  id='expenseGradient'
                  x1='0'
                  y1='0'
                  x2='0'
                  y2='1'
                >
                  <stop offset='5%' stopColor='#ef4444' stopOpacity={0.3} />
                  <stop offset='95%' stopColor='#ef4444' stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id='netGradient' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='#3b82f6' stopOpacity={0.3} />
                  <stop offset='95%' stopColor='#3b82f6' stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray='3 3'
                stroke='#f1f5f9'
                vertical={false}
              />

              <XAxis
                dataKey='date'
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748b' }}
                tickMargin={8}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('es-AR', {
                    day: '2-digit',
                    month: '2-digit',
                  });
                }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748b' }}
                tickMargin={8}
                tickFormatter={(value) => {
                  if (value >= 1000000) {
                    return `$${(value / 1000000).toFixed(1)}M`;
                  } else if (value >= 1000) {
                    return `$${(value / 1000).toFixed(0)}K`;
                  }
                  return `$${value}`;
                }}
              />

              <Tooltip content={<CustomTooltip />} />

              {/* Área de Ingresos */}
              <Area
                type='monotone'
                dataKey='income'
                stroke='#10b981'
                strokeWidth={2}
                fill='url(#incomeGradient)'
                stackId='1'
              />

              {/* Área de Egresos */}
              <Area
                type='monotone'
                dataKey='expenses'
                stroke='#ef4444'
                strokeWidth={2}
                fill='url(#expenseGradient)'
                stackId='1'
              />

              {/* Línea de Flujo Neto */}
              <Line
                type='monotone'
                dataKey='netFlow'
                stroke='#3b82f6'
                strokeWidth={3}
                dot={{
                  fill: '#3b82f6',
                  strokeWidth: 2,
                  r: 4,
                  stroke: '#ffffff',
                }}
                activeDot={{
                  r: 6,
                  stroke: '#3b82f6',
                  strokeWidth: 2,
                  fill: '#ffffff',
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Estadísticas adicionales */}
        <div className='grid grid-cols-2 gap-4 mt-4 pt-4 border-t'>
          <div className='space-y-2'>
            <h4 className='text-sm font-medium'>Mejor Día</h4>
            <div className='text-sm'>
              <div className='text-green-600 font-semibold'>
                {formatNumberToCurrency(bestDay.netFlow)}
              </div>
              <div className='text-xs text-muted-foreground'>
                {new Date(bestDay.date).toLocaleDateString('es-AR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </div>
            </div>
          </div>
          <div className='space-y-2'>
            <h4 className='text-sm font-medium'>Peor Día</h4>
            <div className='text-sm'>
              <div className='text-red-600 font-semibold'>
                {formatNumberToCurrency(worstDay.netFlow)}
              </div>
              <div className='text-xs text-muted-foreground'>
                {new Date(worstDay.date).toLocaleDateString('es-AR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Resumen de flujo acumulado */}
        <div className='mt-4 pt-4 border-t'>
          <h4 className='text-sm font-medium mb-2'>Flujo Acumulado</h4>
          <div className='flex items-center justify-between'>
            <span className='text-sm text-muted-foreground'>
              Promedio diario:
            </span>
            <span
              className={cn(
                'text-sm font-semibold',
                avgDailyFlow >= 0 ? 'text-green-600' : 'text-red-600'
              )}
            >
              {formatNumberToCurrency(avgDailyFlow)}
            </span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-sm text-muted-foreground'>Saldo final:</span>
            <span
              className={cn(
                'text-sm font-semibold',
                lastValue >= 0 ? 'text-blue-600' : 'text-orange-600'
              )}
            >
              {formatNumberToCurrency(lastValue)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// COMPONENTE CON ERROR BOUNDARY
// ============================================================================

export function CashFlowChartWithErrorBoundary(props: CashFlowChartProps) {
  return (
    <ErrorBoundary fallback={ChartErrorFallback}>
      <CashFlowChart {...props} />
    </ErrorBoundary>
  );
}

// ============================================================================
// COMPONENTE CON DATOS AUTOMÁTICOS
// ============================================================================

export function CashFlowChartAuto() {
  const [data, setData] = React.useState<DailyCashFlowData[] | undefined>(
    undefined
  );
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | undefined>(undefined);

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(undefined);

      const response = await getDailyCashFlow();

      if (response.success && response.data) {
        setData(response.data.data);
      } else {
        throw new Error(response.error || 'Error al obtener flujo de caja');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <CashFlowChartWithErrorBoundary
      data={data}
      loading={loading}
      error={error}
      onRefresh={fetchData}
    />
  );
}
