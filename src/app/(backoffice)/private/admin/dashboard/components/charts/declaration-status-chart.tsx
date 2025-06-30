'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  RefreshCw,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { formatNumberToCurrency } from '@/lib/formatters';
import { DeclarationStatusData } from '../../types/dashboard.types';
import { ChartSkeleton } from '../ui/chart-skeleton';
import { ErrorBoundary, ChartErrorFallback } from '../ui/error-boundary';
import { getDeclarationStatus } from '../../services/declarations-data.service';

// ============================================================================
// TIPOS Y CONFIGURACIONES
// ============================================================================

interface DeclarationStatusChartProps {
  data?: DeclarationStatusData[];
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
// CONFIGURACIÓN DE ESTADOS
// ============================================================================

const STATUS_CONFIG = {
  pending_payment: {
    label: 'Pendiente de Pago',
    color: '#f59e0b',
    icon: Clock,
    bgColor: '#fef3c7',
  },
  under_review: {
    label: 'En Revisión',
    color: '#3b82f6',
    icon: FileText,
    bgColor: '#dbeafe',
  },
  approved: {
    label: 'Aprobada',
    color: '#10b981',
    icon: CheckCircle,
    bgColor: '#d1fae5',
  },
  refused: {
    label: 'Rechazada',
    color: '#ef4444',
    icon: XCircle,
    bgColor: '#fee2e2',
  },
  defeated: {
    label: 'Vencida',
    color: '#6b7280',
    icon: AlertCircle,
    bgColor: '#f3f4f6',
  },
};

// ============================================================================
// COMPONENTE DE TOOLTIP PERSONALIZADO
// ============================================================================

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload as DeclarationStatusData;
    const config = STATUS_CONFIG[data.status];

    return (
      <div className='bg-background border border-border rounded-lg shadow-lg p-3'>
        <div className='flex items-center space-x-2 mb-2'>
          <config.icon className='h-4 w-4' style={{ color: config.color }} />
          <p className='font-medium text-sm'>{config.label}</p>
        </div>
        <div className='space-y-1'>
          <div className='flex items-center justify-between'>
            <span className='text-xs text-muted-foreground'>Cantidad:</span>
            <span className='text-sm font-semibold'>{data.count}</span>
          </div>
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
// COMPONENTE PRINCIPAL
// ============================================================================

export function DeclarationStatusChart({
  data,
  loading = false,
  error,
  onRefresh,
  className,
  height = 400,
}: DeclarationStatusChartProps) {
  if (loading) {
    return <ChartSkeleton title='Estado de Declaraciones' height={height} />;
  }

  if (error) {
    return (
      <Card className={cn('border-destructive/20', className)}>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium text-destructive'>
            Estado de Declaraciones
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
            Estado de Declaraciones
          </CardTitle>
          <FileText className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent className='flex flex-col items-center justify-center py-8'>
          <FileText className='h-8 w-8 text-muted-foreground mb-4' />
          <h3 className='text-lg font-semibold mb-2'>Sin datos disponibles</h3>
          <p className='text-sm text-muted-foreground text-center'>
            No hay declaraciones para mostrar en el período seleccionado.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calcular totales
  const totalDeclarations = data.reduce((sum, item) => sum + item.count, 0);
  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);

  // Ordenar datos por cantidad
  const sortedData = [...data]
    .filter((item) => item.status !== 'defeated')
    .sort((a, b) => b.count - a.count);

  return (
    <Card className={cn('border-border', className)}>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <div className='space-y-1'>
          <CardTitle className='text-sm font-medium'>
            Estado de Declaraciones
          </CardTitle>
          <div className='flex items-center space-x-4'>
            <span className='text-xs text-muted-foreground'>
              Total: {totalDeclarations} declaraciones
            </span>
            <span className='text-xs text-muted-foreground'>•</span>
            <span className='text-xs text-muted-foreground'>
              Monto: {formatNumberToCurrency(totalAmount)}
            </span>
          </div>
        </div>
        <FileText className='h-4 w-4 text-muted-foreground' />
      </CardHeader>

      <CardContent>
        <div className='h-[400px] w-full'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart
              data={sortedData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid
                strokeDasharray='3 3'
                stroke='#f1f5f9'
                vertical={false}
              />

              <XAxis
                dataKey='status'
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748b' }}
                tickMargin={8}
                tickFormatter={(value) =>
                  STATUS_CONFIG[value as keyof typeof STATUS_CONFIG]?.label ||
                  value
                }
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748b' }}
                tickMargin={8}
              />

              <Tooltip content={<CustomTooltip />} />

              <Bar dataKey='count' radius={[4, 4, 0, 0]}>
                {sortedData.map((entry, index) => {
                  const config = STATUS_CONFIG[entry.status];
                  return <Cell key={`cell-${index}`} fill={config.color} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Leyenda de estados */}
        <div className='mt-6 grid grid-cols-2 gap-4'>
          {sortedData.map((item) => {
            const config = STATUS_CONFIG[item.status];
            return (
              <div
                key={item.status}
                className='flex items-center justify-between p-3 rounded-lg'
                style={{ backgroundColor: config.bgColor }}
              >
                <div className='flex items-center space-x-2'>
                  <config.icon
                    className='h-4 w-4'
                    style={{ color: config.color }}
                  />
                  <span className='text-sm font-medium'>{config.label}</span>
                </div>
                <div className='text-right'>
                  <div className='text-sm font-semibold'>{item.count}</div>
                  <div className='text-xs text-muted-foreground'>
                    {item.percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Resumen de montos */}
        <div className='mt-4 pt-4 border-t'>
          <h4 className='text-sm font-medium mb-2'>Resumen por Montos</h4>
          <div className='grid grid-cols-2 gap-4'>
            {sortedData.map((item) => {
              const config = STATUS_CONFIG[item.status];
              return (
                <div
                  key={`amount-${item.status}`}
                  className='flex items-center justify-between'
                >
                  <div className='flex items-center space-x-2'>
                    <div
                      className='w-2 h-2 rounded-full'
                      style={{ backgroundColor: config.color }}
                    />
                    <span className='text-xs text-muted-foreground'>
                      {config.label}
                    </span>
                  </div>
                  <span className='text-xs font-semibold'>
                    {formatNumberToCurrency(item.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// COMPONENTE CON ERROR BOUNDARY
// ============================================================================

export function DeclarationStatusChartWithErrorBoundary(
  props: DeclarationStatusChartProps
) {
  return (
    <ErrorBoundary fallback={ChartErrorFallback}>
      <DeclarationStatusChart {...props} />
    </ErrorBoundary>
  );
}

// ============================================================================
// COMPONENTE CON DATOS AUTOMÁTICOS
// ============================================================================

export function DeclarationStatusChartAuto() {
  const [data, setData] = React.useState<DeclarationStatusData[] | undefined>(
    undefined
  );
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | undefined>(undefined);

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(undefined);

      const response = await getDeclarationStatus();

      if (response.success && response.data) {
        setData(response.data.data);
      } else {
        throw new Error(
          response.error || 'Error al obtener estado de declaraciones'
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
    <DeclarationStatusChartWithErrorBoundary
      data={data}
      loading={loading}
      error={error}
      onRefresh={fetchData}
    />
  );
}
