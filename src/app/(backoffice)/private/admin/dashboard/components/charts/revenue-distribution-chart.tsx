'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Sector,
} from 'recharts';
import {
  RefreshCw,
  PieChart as PieChartIcon,
  AlertTriangle,
  DollarSign,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { formatNumberToCurrency } from '@/lib/formatters';
import { RevenueDistributionData } from '../../types/dashboard.types';
import { ChartSkeleton } from '../ui/chart-skeleton';
import { ErrorBoundary, ChartErrorFallback } from '../ui/error-boundary';
import { getRevenueDistribution } from '../../services/revenue-data.service';

// ============================================================================
// TIPOS Y CONFIGURACIONES
// ============================================================================

interface RevenueDistributionChartProps {
  data?: RevenueDistributionData[];
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

interface ActiveShapeProps {
  cx?: number;
  cy?: number;
  innerRadius?: number;
  outerRadius?: number;
  startAngle?: number;
  endAngle?: number;
  fill?: string;
  payload?: RevenueDistributionData;
  percent?: number;
  value?: number;
}

// ============================================================================
// COLORES PARA EL GRÁFICO
// ============================================================================

const COLORS = [
  '#3b82f6', // Blue
  '#10b981', // Green
  '#f59e0b', // Yellow
  '#ef4444', // Red
  '#8b5cf6', // Purple
  '#06b6d4', // Cyan
  '#84cc16', // Lime
  '#f97316', // Orange
];

// ============================================================================
// COMPONENTE DE TOOLTIP PERSONALIZADO
// ============================================================================

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload as RevenueDistributionData;

    return (
      <div className='bg-background border border-border rounded-lg shadow-lg p-3'>
        <p className='font-medium text-sm' style={{ color: data.color }}>
          {data.type}
        </p>
        <div className='space-y-1 mt-2'>
          <div className='flex items-center justify-between'>
            <span className='text-xs text-muted-foreground'>Monto:</span>
            <span className='text-sm font-semibold'>
              {formatNumberToCurrency(data.amount)}
            </span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-xs text-muted-foreground'>Porcentaje:</span>
            <span className='text-sm font-semibold'>
              {data.percentage.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// ============================================================================
// COMPONENTE DE SECTOR ACTIVO
// ============================================================================

function ActiveShape({
  cx = 0,
  cy = 0,
  innerRadius = 0,
  outerRadius = 0,
  startAngle = 0,
  endAngle = 0,
  fill = '#000',
  payload,
  percent = 0,
  value = 0,
}: ActiveShapeProps) {
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <text
        x={cx}
        y={cy}
        dy={8}
        textAnchor='middle'
        fill='#333'
        className='text-sm font-medium'
      >
        {payload?.type}
      </text>
      <text
        x={cx}
        y={cy}
        dy={30}
        textAnchor='middle'
        fill='#666'
        className='text-xs'
      >
        {formatNumberToCurrency(value)}
      </text>
      <text
        x={cx}
        y={cy}
        dy={45}
        textAnchor='middle'
        fill='#999'
        className='text-xs'
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    </g>
  );
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export function RevenueDistributionChart({
  data,
  loading = false,
  error,
  onRefresh,
  className,
  height = 400,
}: RevenueDistributionChartProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const onPieEnter = React.useCallback((_: any, index: number) => {
    setActiveIndex(index);
  }, []);

  if (loading) {
    return (
      <ChartSkeleton title='Distribución de Recaudación' height={height} />
    );
  }

  if (error) {
    return (
      <Card className={cn('border-destructive/20', className)}>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium text-destructive'>
            Distribución de Recaudación
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
            Distribución de Recaudación
          </CardTitle>
          <PieChartIcon className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent className='flex flex-col items-center justify-center py-8'>
          <DollarSign className='h-8 w-8 text-muted-foreground mb-4' />
          <h3 className='text-lg font-semibold mb-2'>Sin datos disponibles</h3>
          <p className='text-sm text-muted-foreground text-center'>
            No hay datos de distribución para mostrar en el período
            seleccionado.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calcular total
  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Card className={cn('border-border', className)}>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <div className='space-y-1'>
          <CardTitle className='text-sm font-medium'>
            Distribución de Recaudación
          </CardTitle>
          <p className='text-xs text-muted-foreground'>
            Total: {formatNumberToCurrency(totalAmount)}
          </p>
        </div>
        <PieChartIcon className='h-4 w-4 text-muted-foreground' />
      </CardHeader>

      <CardContent>
        <div className='h-[400px] w-full'>
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              <Pie
                data={data}
                cx='50%'
                cy='50%'
                innerRadius={60}
                outerRadius={120}
                fill='#8884d8'
                dataKey='amount'
                onMouseEnter={onPieEnter}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color || COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign='bottom'
                height={36}
                formatter={(value, entry: any) => (
                  <span className='text-sm'>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Lista de distribución */}
        <div className='mt-4 space-y-2'>
          {data.map((item, index) => (
            <div
              key={index}
              className='flex items-center justify-between p-2 rounded-lg bg-muted/50'
            >
              <div className='flex items-center space-x-2'>
                <div
                  className='w-3 h-3 rounded-full'
                  style={{
                    backgroundColor:
                      item.color || COLORS[index % COLORS.length],
                  }}
                />
                <span className='text-sm font-medium'>{item.type}</span>
              </div>
              <div className='text-right'>
                <div className='text-sm font-semibold'>
                  {formatNumberToCurrency(item.amount)}
                </div>
                <div className='text-xs text-muted-foreground'>
                  {item.percentage.toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// COMPONENTE CON ERROR BOUNDARY
// ============================================================================

export function RevenueDistributionChartWithErrorBoundary(
  props: RevenueDistributionChartProps
) {
  return (
    <ErrorBoundary fallback={ChartErrorFallback}>
      <RevenueDistributionChart {...props} />
    </ErrorBoundary>
  );
}

// ============================================================================
// COMPONENTE CON DATOS AUTOMÁTICOS
// ============================================================================

export function RevenueDistributionChartAuto() {
  const [data, setData] = React.useState<RevenueDistributionData[] | undefined>(
    undefined
  );
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | undefined>(undefined);

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(undefined);

      const response = await getRevenueDistribution();

      if (response.success && response.data) {
        setData(response.data.data);
      } else {
        throw new Error(
          response.error || 'Error al obtener distribución de recaudación'
        );
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
    <RevenueDistributionChartWithErrorBoundary
      data={data}
      loading={loading}
      error={error}
      onRefresh={fetchData}
    />
  );
}
