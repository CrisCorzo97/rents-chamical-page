'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  Building2,
  Home,
  Landmark,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { formatNumberToCurrency } from '@/lib/formatters';
import { FinancialMetrics } from '../../types/dashboard.types';
import { CardSkeleton, FinancialMetricsSkeleton } from '../ui/card-skeleton';
import { ErrorBoundary, ChartErrorFallback } from '../ui/error-boundary';
import { getFinancialMetrics } from '../../services/dashboard-metrics.service';

// ============================================================================
// TIPOS Y CONFIGURACIONES
// ============================================================================

interface MetricCardProps {
  title: string;
  value: number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    label: string;
  };
  variant?: 'default' | 'success' | 'warning' | 'destructive';
  loading?: boolean;
  error?: string;
}

interface FinancialMetricsCardsProps {
  data?: FinancialMetrics;
  loading?: boolean;
  error?: string;
  onRefresh?: () => void;
  className?: string;
}

// ============================================================================
// COMPONENTE DE CARD INDIVIDUAL
// ============================================================================

function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = 'default',
  loading = false,
  error,
}: MetricCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950';
      case 'destructive':
        return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950';
      default:
        return 'border-border bg-card';
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'success':
        return 'text-green-600 dark:text-green-400';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'destructive':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-muted-foreground';
    }
  };

  if (loading) {
    return <CardSkeleton title={title} showTrend={!!trend} />;
  }

  if (error) {
    return (
      <Card
        className={cn(
          'h-52 flex flex-col justify-between border-destructive/20',
          getVariantStyles()
        )}
      >
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium text-destructive'>
            {title}
          </CardTitle>
          <AlertTriangle className='h-4 w-4 text-destructive' />
        </CardHeader>
        <CardContent>
          <p className='text-xs text-destructive'>{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn('h-52 flex flex-col justify-between', getVariantStyles())}
    >
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        <div className={cn('h-4 w-4', getIconColor())}>{icon}</div>
      </CardHeader>

      <CardContent className='space-y-2'>
        <div className='text-2xl font-bold'>
          {formatNumberToCurrency(value)}
        </div>

        {subtitle && (
          <p className='text-xs text-muted-foreground'>{subtitle}</p>
        )}

        {trend && (
          <div className='flex items-center space-x-2'>
            {trend.isPositive ? (
              <TrendingUp className='h-3 w-3 text-green-600' />
            ) : (
              <TrendingDown className='h-3 w-3 text-red-600' />
            )}
            <Badge
              variant={trend.isPositive ? 'default' : 'destructive'}
              className='text-xs'
            >
              {trend.isPositive ? '+' : ''}
              {trend.value}%
            </Badge>
            <span className='text-xs text-muted-foreground'>{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export function FinancialMetricsCards({
  data,
  loading = false,
  error,
  onRefresh,
  className,
}: FinancialMetricsCardsProps) {
  if (loading) {
    return <FinancialMetricsSkeleton />;
  }

  if (error) {
    return (
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
        <Card className='col-span-full border-destructive/20'>
          <CardContent className='flex flex-col items-center justify-center py-8'>
            <AlertTriangle className='h-8 w-8 text-destructive mb-4' />
            <h3 className='text-lg font-semibold text-destructive mb-2'>
              Error al cargar métricas
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
      </div>
    );
  }

  if (!data) {
    return <FinancialMetricsSkeleton />;
  }

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3',
        className
      )}
    >
      {/* Total Recaudado */}
      <MetricCard
        title='Total Recaudado'
        value={data.totalCollected}
        subtitle='Este mes'
        icon={<DollarSign />}
        variant='success'
        trend={{
          value: 12.5, // TODO: Calcular tendencia real
          isPositive: true,
          label: 'vs mes anterior',
        }}
      />

      {/* Total Pendiente */}
      <MetricCard
        title='Total Pendiente'
        value={data.totalPending}
        subtitle='Por cobrar'
        icon={<AlertTriangle />}
        variant='warning'
        trend={{
          value: 8.2, // TODO: Calcular tendencia real
          isPositive: false,
          label: 'vs mes anterior',
        }}
      />

      {/* Total Multas */}
      <MetricCard
        title='Total Multas'
        value={data.totalPenalties}
        subtitle='Impagas'
        icon={<AlertTriangle />}
        variant='destructive'
      />

      {/* Habilitaciones Comerciales */}
      <MetricCard
        title='Habilitaciones'
        value={data.totalCommercialEnablements}
        subtitle='Activas'
        icon={<Building2 />}
      />

      {/* Propiedades */}
      <MetricCard
        title='Propiedades'
        value={data.totalProperties}
        subtitle='Registradas'
        icon={<Home />}
      />

      {/* Cementerio */}
      <MetricCard
        title='Cementerio'
        value={data.totalCementery}
        subtitle='Servicios'
        icon={<Landmark />}
      />
    </div>
  );
}

// ============================================================================
// COMPONENTE CON ERROR BOUNDARY
// ============================================================================

export function FinancialMetricsCardsWithErrorBoundary(
  props: FinancialMetricsCardsProps
) {
  return (
    <ErrorBoundary fallback={ChartErrorFallback}>
      <FinancialMetricsCards {...props} />
    </ErrorBoundary>
  );
}

// ============================================================================
// COMPONENTE CON DATOS AUTOMÁTICOS
// ============================================================================

export function FinancialMetricsCardsAuto() {
  const [data, setData] = React.useState<FinancialMetrics | undefined>(
    undefined
  );
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | undefined>(undefined);

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(undefined);

      const response = await getFinancialMetrics();

      if (response.success && response.data) {
        setData(response.data);
      } else {
        throw new Error(
          response.error || 'Error al obtener métricas financieras'
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
    <FinancialMetricsCardsWithErrorBoundary
      data={data}
      loading={loading}
      error={error}
      onRefresh={fetchData}
    />
  );
}
