'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Calendar,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { formatNumberToCurrency } from '@/lib/formatters';
import { RevenueTimelineData } from '../../types/dashboard.types';
import { ChartSkeleton } from '../ui/chart-skeleton';
import { ErrorBoundary, ChartErrorFallback } from '../ui/error-boundary';
import { getRevenueTimeline } from '../../services/revenue-data.service';

// ============================================================================
// TIPOS Y CONFIGURACIONES
// ============================================================================

interface RevenueTimelineChartProps {
  data?: RevenueTimelineData[];
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
    const data = payload[0].payload;

    return (
      <div className='bg-background border border-border rounded-lg shadow-lg p-3'>
        <p className='font-medium text-sm'>{label}</p>
        <div className='space-y-1 mt-2'>
          <div className='flex items-center justify-between'>
            <span className='text-xs text-muted-foreground'>Ingresos:</span>
            <span className='text-sm font-semibold text-primary'>
              {formatNumberToCurrency(data.total)}
            </span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-xs text-muted-foreground'>
              Declaraciones:
            </span>
            <span className='text-sm font-semibold'>{data.declarations}</span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-xs text-muted-foreground'>Pagos:</span>
            <span className='text-sm font-semibold'>{data.payments}</span>
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

export function RevenueTimelineChart({
  data,
  loading = false,
  error,
  onRefresh,
  className,
  height = 400,
}: RevenueTimelineChartProps) {
  if (loading) {
    return <ChartSkeleton title='Evolución de Ingresos' height={height} />;
  }

  if (error) {
    return (
      <Card className={cn('border-destructive/20', className)}>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium text-destructive'>
            Evolución de Ingresos
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
            Evolución de Ingresos
          </CardTitle>
          <Calendar className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent className='flex flex-col items-center justify-center py-8'>
          <DollarSign className='h-8 w-8 text-muted-foreground mb-4' />
          <h3 className='text-lg font-semibold mb-2'>Sin datos disponibles</h3>
          <p className='text-sm text-muted-foreground text-center'>
            No hay datos de ingresos para mostrar en el período seleccionado.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calcular estadísticas
  const totalRevenue = data.reduce((sum, item) => sum + item.total, 0);
  const avgRevenue = totalRevenue / data.length;
  const maxRevenue = Math.max(...data.map((item) => item.total));
  const minRevenue = Math.min(...data.map((item) => item.total));

  // Calcular tendencia
  const firstValue = data[0]?.total || 0;
  const lastValue = data[data.length - 1]?.total || 0;
  const trendPercentage =
    firstValue > 0 ? ((lastValue - firstValue) / firstValue) * 100 : 0;
  const isTrendPositive = trendPercentage >= 0;

  return (
    <Card className={cn('border-border', className)}>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <div className='space-y-1'>
          <CardTitle className='text-sm font-medium'>
            Evolución de Ingresos
          </CardTitle>
          <div className='flex items-center space-x-2'>
            <span className='text-xs text-muted-foreground'>
              Total: {formatNumberToCurrency(totalRevenue)}
            </span>
            <span className='text-xs text-muted-foreground'>•</span>
            <span className='text-xs text-muted-foreground'>
              Promedio: {formatNumberToCurrency(avgRevenue)}
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
            <AreaChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <defs>
                <linearGradient
                  id='revenueGradient'
                  x1='0'
                  y1='0'
                  x2='0'
                  y2='1'
                >
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
                dataKey='period'
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748b' }}
                tickMargin={8}
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

              <Area
                type='monotone'
                dataKey='total'
                stroke='#3b82f6'
                strokeWidth={2}
                fill='url(#revenueGradient)'
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
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Estadísticas adicionales */}
        <div className='grid grid-cols-3 gap-4 mt-4 pt-4 border-t'>
          <div className='text-center'>
            <p className='text-xs text-muted-foreground'>Máximo</p>
            <p className='text-sm font-semibold text-green-600'>
              {formatNumberToCurrency(maxRevenue)}
            </p>
          </div>
          <div className='text-center'>
            <p className='text-xs text-muted-foreground'>Mínimo</p>
            <p className='text-sm font-semibold text-red-600'>
              {formatNumberToCurrency(minRevenue)}
            </p>
          </div>
          <div className='text-center'>
            <p className='text-xs text-muted-foreground'>Promedio</p>
            <p className='text-sm font-semibold text-blue-600'>
              {formatNumberToCurrency(avgRevenue)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// COMPONENTE CON ERROR BOUNDARY
// ============================================================================

export function RevenueTimelineChartWithErrorBoundary(
  props: RevenueTimelineChartProps
) {
  return (
    <ErrorBoundary fallback={ChartErrorFallback}>
      <RevenueTimelineChart {...props} />
    </ErrorBoundary>
  );
}

// ============================================================================
// COMPONENTE CON DATOS AUTOMÁTICOS
// ============================================================================

export function RevenueTimelineChartAuto() {
  const [data, setData] = React.useState<RevenueTimelineData[] | undefined>(
    undefined
  );
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | undefined>(undefined);

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(undefined);

      const response = await getRevenueTimeline();

      if (response.success && response.data) {
        setData(response.data.data);
      } else {
        throw new Error(response.error || 'Error al obtener datos de ingresos');
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
    <RevenueTimelineChartWithErrorBoundary
      data={data}
      loading={loading}
      error={error}
      onRefresh={fetchData}
    />
  );
}
