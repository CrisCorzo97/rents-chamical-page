'use client';

import { Button, Card, CardContent } from '@/components/ui';
import {
  AlertTriangle,
  DollarSign,
  Download,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import { Suspense } from 'react';
import { DashboardSettings } from './components/dashboard-settings';
import { FinancialMetricsCardsAuto } from './components/charts/financial-metrics-cards';
import { CashFlowChartAuto } from './components/charts/cash-flow-chart';
import { DeclarationStatusChartAuto } from './components/charts/declaration-status-chart';
import { RevenueDistributionChartAuto } from './components/charts/revenue-distribution-chart';
import { RevenueTimelineChartAuto } from './components/charts/revenue-timeline-chart';
import { DateRangePicker } from './components/filters/date-range-picker';
import { DashboardStatusSimple } from './components/ui/dashboard-status';
import { useDashboardState } from './hooks/use-dashboard-state';
import { useDashboardFilters } from './hooks/use-dashboard-filters';
import { invalidateDashboardCache } from './services/cache.service';
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
  // Usar el hook de estado global del dashboard
  const [state, actions] = useDashboardState();

  // Usar el hook de filtros
  const {
    filters,
    updateFilters,
    resetFilters,
    refreshAllData,
    isLoading: filtersLoading,
  } = useDashboardFilters();

  // Función de refresh que invalida el cache y actualiza el estado
  const handleRefresh = async () => {
    try {
      await actions.refresh();
      // Invalidar cache del dashboard
      await invalidateDashboardCache();
      // Refrescar todos los datos
      refreshAllData();
      console.log('Dashboard refreshed successfully');
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
      actions.setError('Error al actualizar el dashboard');
    }
  };

  // Función de exportación
  const handleExport = async () => {
    try {
      await actions.exportData('csv');
    } catch (error) {
      console.error('Error exporting data:', error);
      actions.setError('Error al exportar datos');
    }
  };

  // Función para cambiar visibilidad de gráficos
  const handleChartVisibilityChange = (chartId: string, visible: boolean) => {
    actions.setChartVisibility(
      chartId as keyof typeof state.visibleCharts,
      visible
    );
  };

  // Función para manejar cambios de fecha
  const handleDateRangeChange = (startDate: Date, endDate: Date) => {
    updateFilters({ startDate, endDate });
  };

  // Función para resetear filtros
  const handleResetFilters = () => {
    resetFilters();
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
          <Button
            variant='outline'
            size='sm'
            onClick={handleRefresh}
            disabled={state.isRefreshing || filtersLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${state.isRefreshing || filtersLoading ? 'animate-spin' : ''}`}
            />
            {state.isRefreshing || filtersLoading
              ? 'Actualizando...'
              : 'Actualizar'}
          </Button>
          <Button variant='outline' size='sm' onClick={handleExport} disabled>
            <Download
              className={`h-4 w-4 mr-2 ${state.isExporting ? 'animate-spin' : ''}`}
            />
            {state.isExporting ? 'Exportando...' : 'Exportar'}
          </Button>
          <DashboardSettings
            autoRefresh={state.autoRefresh}
            refreshInterval={state.refreshInterval}
            selectedPeriod={state.selectedPeriod}
            visibleCharts={state.visibleCharts}
            onAutoRefreshChange={actions.setAutoRefresh}
            onRefreshIntervalChange={actions.setRefreshInterval}
            onPeriodChange={actions.setSelectedPeriod}
            onChartVisibilityChange={handleChartVisibilityChange}
            onRefresh={handleRefresh}
            onExport={handleExport}
          />
        </div>
      </div>

      {/* Estado del Dashboard */}
      <DashboardStatusSimple
        isLoading={state.isLoading}
        isRefreshing={state.isRefreshing || filtersLoading}
        lastUpdated={state.lastUpdated}
        error={state.error}
        onRefresh={handleRefresh}
      />

      {/* Cards de Métricas Financieras */}
      {state.visibleCharts.financialMetrics && (
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
        {state.visibleCharts.revenueTimeline && (
          <Card className='h-full'>
            <CardContent className='p-0'>
              <Suspense fallback={<DashboardLoading />}>
                <RevenueTimelineChartAuto />
              </Suspense>
            </CardContent>
          </Card>
        )}

        {/* Gráfico de Distribución */}
        {state.visibleCharts.revenueDistribution && (
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
        {state.visibleCharts.declarationStatus && (
          <Card className='h-full'>
            <CardContent className='p-0'>
              <Suspense fallback={<DashboardLoading />}>
                <DeclarationStatusChartAuto />
              </Suspense>
            </CardContent>
          </Card>
        )}

        {/* Flujo de Caja Diario */}
        {state.visibleCharts.cashFlow && (
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
            <DateRangePicker
              startDate={filters.startDate || undefined}
              endDate={filters.endDate || undefined}
              onDateChange={handleDateRangeChange}
              onReset={handleResetFilters}
              loading={state.isRefreshing || filtersLoading}
            />
          </CardContent>
        </Card>

        {/* Información del Período */}
        <Card className='border-dashed'>
          <CardContent className='p-6'>
            <h3 className='text-sm font-medium mb-4'>
              Información del Período
            </h3>
            <div className='space-y-2 text-sm'>
              <div>
                <span className='text-muted-foreground'>
                  Período seleccionado:
                </span>
                <span className='ml-2 font-medium'>
                  {filters.period === 'daily' && 'Diario'}
                  {filters.period === 'weekly' && 'Semanal'}
                  {filters.period === 'monthly' && 'Mensual'}
                  {filters.period === 'yearly' && 'Anual'}
                </span>
              </div>
              <div>
                <span className='text-muted-foreground'>Rango de fechas:</span>
                <span className='ml-2 font-medium'>
                  {filters.startDate && filters.endDate
                    ? `${dayjs(filters.startDate).format('DD/MM/YYYY')} - ${dayjs(filters.endDate).format('DD/MM/YYYY')}`
                    : 'No seleccionado'}
                </span>
              </div>
              <div>
                <span className='text-muted-foreground'>
                  Próxima actualización:
                </span>
                <span className='ml-2 font-medium'>
                  {state.nextRefresh
                    ? dayjs(state.nextRefresh).format('HH:mm:ss')
                    : 'No programada'}
                </span>
              </div>
              <div>
                <span className='text-muted-foreground'>Auto-refresh:</span>
                <span className='ml-2 font-medium'>
                  {filters.autoRefresh ? 'Activado' : 'Desactivado'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
