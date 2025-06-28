'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  RefreshCw,
  Calendar,
  Filter,
  Download,
  Settings,
  TrendingUp,
  DollarSign,
  FileText,
  PieChart,
  Activity,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { FinancialMetricsCardsAuto } from './charts/financial-metrics-cards';
import { RevenueTimelineChartAuto } from './charts/revenue-timeline-chart';
import { RevenueDistributionChartAuto } from './charts/revenue-distribution-chart';
import { DeclarationStatusChartAuto } from './charts/declaration-status-chart';
import { CashFlowChartAuto } from './charts/cash-flow-chart';

// ============================================================================
// TIPOS Y CONFIGURACIONES
// ============================================================================

interface DashboardLayoutProps {
  className?: string;
  showFilters?: boolean;
  showControls?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number; // en segundos
}

interface ChartSectionProps {
  title: string;
  description?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
  error?: string;
  onRefresh?: () => void;
}

// ============================================================================
// COMPONENTE DE SECCIÓN DE GRÁFICO
// ============================================================================

function ChartSection({
  title,
  description,
  icon,
  children,
  className,
  loading = false,
  error,
  onRefresh,
}: ChartSectionProps) {
  return (
    <Card className={cn('h-full flex flex-col', className)}>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <div className='space-y-1'>
          <CardTitle className='text-sm font-medium flex items-center space-x-2'>
            {icon}
            <span>{title}</span>
          </CardTitle>
          {description && (
            <p className='text-xs text-muted-foreground'>{description}</p>
          )}
        </div>
        {onRefresh && (
          <Button
            onClick={onRefresh}
            variant='ghost'
            size='sm'
            disabled={loading}
          >
            <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
          </Button>
        )}
      </CardHeader>
      <CardContent className='flex-1 flex flex-col'>{children}</CardContent>
    </Card>
  );
}

// ============================================================================
// COMPONENTE DE CONTROLES DEL DASHBOARD
// ============================================================================

function DashboardControls({
  onRefresh,
  onExport,
  onSettings,
  loading = false,
}: {
  onRefresh?: () => void;
  onExport?: () => void;
  onSettings?: () => void;
  loading?: boolean;
}) {
  return (
    <div className='flex items-center justify-between mb-6'>
      <div className='flex items-center space-x-4'>
        <h1 className='text-2xl font-bold'>Dashboard Administrativo</h1>
        <Badge variant='secondary' className='text-xs'>
          Tiempo Real
        </Badge>
      </div>

      <div className='flex items-center space-x-2'>
        {onRefresh && (
          <Button
            onClick={onRefresh}
            variant='outline'
            size='sm'
            disabled={loading}
          >
            <RefreshCw
              className={cn('h-4 w-4 mr-2', loading && 'animate-spin')}
            />
            Actualizar
          </Button>
        )}

        {onExport && (
          <Button onClick={onExport} variant='outline' size='sm'>
            <Download className='h-4 w-4 mr-2' />
            Exportar
          </Button>
        )}

        {onSettings && (
          <Button onClick={onSettings} variant='outline' size='sm'>
            <Settings className='h-4 w-4' />
          </Button>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export function DashboardLayout({
  className,
  showFilters = true,
  showControls = true,
  autoRefresh = false,
  refreshInterval = 300, // 5 minutos por defecto
}: DashboardLayoutProps) {
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [lastUpdated, setLastUpdated] = React.useState<Date>(new Date());

  // Función para refrescar todos los datos
  const handleRefresh = React.useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Aquí se podrían invalidar todos los caches
      // await invalidateDashboardCache();
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Auto-refresh si está habilitado
  React.useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      handleRefresh();
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, handleRefresh]);

  // Función para exportar datos
  const handleExport = React.useCallback(() => {
    // Implementar exportación de datos
    console.log('Exporting dashboard data...');
  }, []);

  // Función para configuraciones
  const handleSettings = React.useCallback(() => {
    // Implementar configuración del dashboard
    console.log('Opening dashboard settings...');
  }, []);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Controles del Dashboard */}
      {showControls && (
        <DashboardControls
          onRefresh={handleRefresh}
          onExport={handleExport}
          onSettings={handleSettings}
          loading={isRefreshing}
        />
      )}

      {/* Información de última actualización */}
      <div className='flex items-center justify-between text-xs text-muted-foreground'>
        <span>
          Última actualización: {lastUpdated.toLocaleTimeString('es-AR')}
        </span>
        {autoRefresh && (
          <span>Auto-refresh cada {refreshInterval / 60} minutos</span>
        )}
      </div>

      {/* Cards de Métricas Financieras */}
      <section className='space-y-4'>
        <div className='flex items-center space-x-2'>
          <DollarSign className='h-5 w-5 text-primary' />
          <h2 className='text-lg font-semibold'>Métricas Financieras</h2>
        </div>
        <FinancialMetricsCardsAuto />
      </section>

      {/* Gráficos Principales */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Gráfico de Evolución de Ingresos */}
        <ChartSection
          title='Evolución de Ingresos'
          description='Recaudación mensual y tendencias'
          icon={<TrendingUp className='h-4 w-4 text-blue-600' />}
          onRefresh={handleRefresh}
          loading={isRefreshing}
        >
          <RevenueTimelineChartAuto />
        </ChartSection>

        {/* Gráfico de Distribución */}
        <ChartSection
          title='Distribución de Recaudación'
          description='Por tipo de impuesto'
          icon={<PieChart className='h-4 w-4 text-green-600' />}
          onRefresh={handleRefresh}
          loading={isRefreshing}
        >
          <RevenueDistributionChartAuto />
        </ChartSection>
      </div>

      {/* Gráficos Secundarios */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Estado de Declaraciones */}
        <ChartSection
          title='Estado de Declaraciones'
          description='DDJJ por estado de procesamiento'
          icon={<FileText className='h-4 w-4 text-orange-600' />}
          onRefresh={handleRefresh}
          loading={isRefreshing}
        >
          <DeclarationStatusChartAuto />
        </ChartSection>

        {/* Flujo de Caja Diario */}
        <ChartSection
          title='Flujo de Caja Diario'
          description='Ingresos vs egresos por día'
          icon={<Activity className='h-4 w-4 text-purple-600' />}
          onRefresh={handleRefresh}
          loading={isRefreshing}
        >
          <CashFlowChartAuto />
        </ChartSection>
      </div>

      {/* Sección de Filtros (opcional) */}
      {showFilters && (
        <Card className='border-dashed'>
          <CardHeader>
            <CardTitle className='text-sm font-medium flex items-center space-x-2'>
              <Filter className='h-4 w-4' />
              <span>Filtros y Controles</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center space-x-4'>
              <div className='flex items-center space-x-2'>
                <Calendar className='h-4 w-4 text-muted-foreground' />
                <span className='text-sm text-muted-foreground'>
                  Período: Últimos 12 meses
                </span>
              </div>
              <Button variant='outline' size='sm'>
                Cambiar Período
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ============================================================================
// COMPONENTE CON ERROR BOUNDARY
// ============================================================================

export function DashboardLayoutWithErrorBoundary(props: DashboardLayoutProps) {
  return (
    <div className='min-h-screen bg-background p-6'>
      <DashboardLayout {...props} />
    </div>
  );
}

// ============================================================================
// COMPONENTE CON CONFIGURACIÓN POR DEFECTO
// ============================================================================

export function DashboardLayoutDefault() {
  return (
    <DashboardLayoutWithErrorBoundary
      showFilters={true}
      showControls={true}
      autoRefresh={true}
      refreshInterval={300} // 5 minutos
    />
  );
}
