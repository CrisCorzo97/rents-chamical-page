'use client';

import { Button, Card, CardContent } from '@/components/ui';
import {
  AlertTriangle,
  DollarSign,
  Download,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import { Suspense, useState } from 'react';
import { DashboardSettings } from './components/dashboard-settings';
import { FinancialMetricsCardsAuto } from './components/charts/financial-metrics-cards';
import { CashFlowChartAuto } from './components/charts/cash-flow-chart';
import { DeclarationStatusChartAuto } from './components/charts/declaration-status-chart';
import { RevenueDistributionChartAuto } from './components/charts/revenue-distribution-chart';
import { RevenueTimelineChartAuto } from './components/charts/revenue-timeline-chart';
import { DateRangePicker } from './components/filters/date-range-picker';
import dayjs from 'dayjs';

// ============================================================================
// COMPONENTE DE LOADING
// ============================================================================

export function DashboardLoading() {
  return (
    <div className='flex flex-col items-center justify-center h-64 space-y-4'>
      <RefreshCw className='h-8 w-8 animate-spin text-primary' />
      <div className='text-center'>
        <h3 className='text-lg font-semibold'>Cargando Dashboard</h3>
        <p className='text-sm text-muted-foreground'>
          Obteniendo datos en tiempo real...
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENTE DE ERROR
// ============================================================================

export function DashboardError({ error }: { error: string }) {
  return (
    <div className='flex flex-col items-center justify-center h-64 space-y-4'>
      <AlertTriangle className='h-8 w-8 text-destructive' />
      <div className='text-center'>
        <h3 className='text-lg font-semibold text-destructive'>
          Error al cargar el Dashboard
        </h3>
        <p className='text-sm text-muted-foreground max-w-md'>{error}</p>
        <Button
          variant='outline'
          className='mt-4'
          onClick={() => window.location.reload()}
        >
          <RefreshCw className='h-4 w-4 mr-2' />
          Reintentar
        </Button>
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENTE PRINCIPAL DEL DASHBOARD
// ============================================================================

export function DashboardContent() {
  // Estados locales para la configuración
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(300);
  const [selectedPeriod, setSelectedPeriod] = useState<
    'daily' | 'weekly' | 'monthly' | 'yearly'
  >('monthly');
  const [visibleCharts, setVisibleCharts] = useState({
    financialMetrics: true,
    revenueTimeline: true,
    revenueDistribution: true,
    declarationStatus: true,
    cashFlow: true,
  });

  const handleRefresh = () => {
    console.log('Refreshing dashboard...');
    // Aquí se implementaría la lógica de refresh
  };

  const handleExport = () => {
    console.log('Exporting dashboard data...');
    // Aquí se implementaría la lógica de exportación
  };

  const handleChartVisibilityChange = (chartId: string, visible: boolean) => {
    setVisibleCharts((prev) => ({
      ...prev,
      [chartId]: visible,
    }));
  };

  return (
    <div className='space-y-6'>
      {/* Controles del Dashboard */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <h1 className='text-2xl font-bold'>Dashboard Administrativo</h1>
          <div className='flex items-center space-x-2'>
            <TrendingUp className='h-5 w-5 text-green-600' />
            <span className='text-sm text-green-600 font-medium'>
              Tiempo Real
            </span>
          </div>
        </div>

        <div className='flex items-center space-x-2'>
          <Button variant='outline' size='sm' onClick={handleRefresh}>
            <RefreshCw className='h-4 w-4 mr-2' />
            Actualizar
          </Button>
          <Button variant='outline' size='sm' onClick={handleExport} disabled>
            <Download className='h-4 w-4 mr-2' />
            Exportar
          </Button>
          <DashboardSettings
            autoRefresh={autoRefresh}
            refreshInterval={refreshInterval}
            selectedPeriod={selectedPeriod}
            visibleCharts={visibleCharts}
            onAutoRefreshChange={setAutoRefresh}
            onRefreshIntervalChange={setRefreshInterval}
            onPeriodChange={setSelectedPeriod}
            onChartVisibilityChange={handleChartVisibilityChange}
            onRefresh={handleRefresh}
            onExport={handleExport}
          />
        </div>
      </div>

      {/* Información de última actualización */}
      <div className='flex items-center justify-between text-xs text-muted-foreground'>
        <span>Última actualización: {dayjs().format('HH:mm')}</span>
        <span>Auto-refresh cada {refreshInterval / 60} minutos</span>
      </div>

      {/* Cards de Métricas Financieras */}
      {visibleCharts.financialMetrics && (
        <section className='space-y-4'>
          <div className='flex items-center space-x-2'>
            <DollarSign className='h-5 w-5 text-primary' />
            <h2 className='text-lg font-semibold'>Métricas Financieras</h2>
          </div>
          <Suspense fallback={<DashboardLoading />}>
            <FinancialMetricsCardsAuto />
          </Suspense>
        </section>
      )}

      {/* Gráficos Principales */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Gráfico de Evolución de Ingresos */}
        {visibleCharts.revenueTimeline && (
          <Card className='h-full'>
            <CardContent className='p-0'>
              <Suspense fallback={<DashboardLoading />}>
                <RevenueTimelineChartAuto />
              </Suspense>
            </CardContent>
          </Card>
        )}

        {/* Gráfico de Distribución */}
        {visibleCharts.revenueDistribution && (
          <Card className='h-full'>
            <CardContent className='p-0'>
              <Suspense fallback={<DashboardLoading />}>
                <RevenueDistributionChartAuto />
              </Suspense>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Gráficos Secundarios */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Estado de Declaraciones */}
        {visibleCharts.declarationStatus && (
          <Card className='h-full'>
            <CardContent className='p-0'>
              <Suspense fallback={<DashboardLoading />}>
                <DeclarationStatusChartAuto />
              </Suspense>
            </CardContent>
          </Card>
        )}

        {/* Flujo de Caja Diario */}
        {visibleCharts.cashFlow && (
          <Card className='h-full'>
            <CardContent className='p-0'>
              <Suspense fallback={<DashboardLoading />}>
                <CashFlowChartAuto />
              </Suspense>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Controles y Filtros */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Filtros de Fecha */}
        <Card className='border-dashed'>
          <CardContent className='p-6'>
            <h3 className='text-sm font-medium mb-4'>Filtros de Fecha</h3>
            <DateRangePicker />
          </CardContent>
        </Card>

        {/* Controles de Gráficos */}
        {/* <Card className='border-dashed'>
          <CardContent className='p-6'>
            <h3 className='text-sm font-medium mb-4'>Controles de Gráficos</h3>
            <ChartControls />
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}
