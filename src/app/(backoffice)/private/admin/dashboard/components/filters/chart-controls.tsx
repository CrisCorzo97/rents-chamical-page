'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Activity,
  Settings,
  RefreshCw,
  Download,
  Eye,
  EyeOff,
} from 'lucide-react';
import { cn } from '@/lib/cn';

// ============================================================================
// TIPOS Y CONFIGURACIONES
// ============================================================================

interface ChartControlsProps {
  className?: string;
  onPeriodChange?: (period: string) => void;
  onChartToggle?: (chartId: string, visible: boolean) => void;
  onRefresh?: () => void;
  onExport?: () => void;
  onSettings?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

interface ChartConfig {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  visible: boolean;
  type: 'card' | 'line' | 'pie' | 'bar' | 'area';
}

// ============================================================================
// CONFIGURACIÓN DE GRÁFICOS
// ============================================================================

const DEFAULT_CHARTS: ChartConfig[] = [
  {
    id: 'financial-metrics',
    title: 'Métricas Financieras',
    icon: <BarChart3 className='h-4 w-4' />,
    description: 'Cards con métricas principales',
    visible: true,
    type: 'card',
  },
  {
    id: 'revenue-timeline',
    title: 'Evolución de Ingresos',
    icon: <TrendingUp className='h-4 w-4' />,
    description: 'Línea temporal de recaudación',
    visible: true,
    type: 'line',
  },
  {
    id: 'revenue-distribution',
    title: 'Distribución de Recaudación',
    icon: <PieChart className='h-4 w-4' />,
    description: 'Distribución por tipo de impuesto',
    visible: true,
    type: 'pie',
  },
  {
    id: 'declaration-status',
    title: 'Estado de Declaraciones',
    icon: <BarChart3 className='h-4 w-4' />,
    description: 'Estado de DDJJ por procesamiento',
    visible: true,
    type: 'bar',
  },
  {
    id: 'cash-flow',
    title: 'Flujo de Caja Diario',
    icon: <Activity className='h-4 w-4' />,
    description: 'Ingresos vs egresos por día',
    visible: true,
    type: 'area',
  },
];

const PERIOD_OPTIONS = [
  { value: 'daily', label: 'Diario' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'monthly', label: 'Mensual' },
  { value: 'yearly', label: 'Anual' },
];

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export function ChartControls({
  className,
  onPeriodChange,
  onChartToggle,
  onRefresh,
  onExport,
  onSettings,
  loading = false,
  disabled = false,
}: ChartControlsProps) {
  const [charts, setCharts] = React.useState<ChartConfig[]>(DEFAULT_CHARTS);
  const [selectedPeriod, setSelectedPeriod] = React.useState('monthly');

  // Función para cambiar período
  const handlePeriodChange = React.useCallback(
    (period: string) => {
      setSelectedPeriod(period);
      if (onPeriodChange) {
        onPeriodChange(period);
      }
    },
    [onPeriodChange]
  );

  // Función para toggle de gráfico
  const handleChartToggle = React.useCallback(
    (chartId: string, visible: boolean) => {
      setCharts((prev) =>
        prev.map((chart) =>
          chart.id === chartId ? { ...chart, visible } : chart
        )
      );

      if (onChartToggle) {
        onChartToggle(chartId, visible);
      }
    },
    [onChartToggle]
  );

  // Función para toggle todos los gráficos
  const handleToggleAll = React.useCallback(
    (visible: boolean) => {
      setCharts((prev) => prev.map((chart) => ({ ...chart, visible })));

      if (onChartToggle) {
        charts.forEach((chart) => {
          onChartToggle(chart.id, visible);
        });
      }
    },
    [charts, onChartToggle]
  );

  // Función para resetear configuración
  const handleReset = React.useCallback(() => {
    setCharts(DEFAULT_CHARTS);
    setSelectedPeriod('monthly');

    if (onPeriodChange) {
      onPeriodChange('monthly');
    }

    if (onChartToggle) {
      DEFAULT_CHARTS.forEach((chart) => {
        onChartToggle(chart.id, chart.visible);
      });
    }
  }, [onPeriodChange, onChartToggle]);

  return (
    <Card className={cn('border-dashed', className)}>
      <CardHeader>
        <CardTitle className='text-sm font-medium flex items-center space-x-2'>
          <Settings className='h-4 w-4' />
          <span>Controles del Dashboard</span>
        </CardTitle>
      </CardHeader>

      <CardContent className='space-y-6'>
        {/* Controles Principales */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <div className='flex items-center space-x-2'>
              <span className='text-sm font-medium'>Período:</span>
              <Select
                value={selectedPeriod}
                onValueChange={handlePeriodChange}
                disabled={disabled}
              >
                <SelectTrigger className='w-32'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PERIOD_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='flex items-center space-x-2'>
              <span className='text-sm font-medium'>Mostrar/Ocultar:</span>
              <Button
                variant='outline'
                size='sm'
                onClick={() => handleToggleAll(true)}
                disabled={disabled}
              >
                <Eye className='h-4 w-4 mr-1' />
                Todos
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => handleToggleAll(false)}
                disabled={disabled}
              >
                <EyeOff className='h-4 w-4 mr-1' />
                Ninguno
              </Button>
            </div>
          </div>

          <div className='flex items-center space-x-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={handleReset}
              disabled={disabled}
            >
              Resetear
            </Button>

            {onRefresh && (
              <Button
                variant='outline'
                size='sm'
                onClick={onRefresh}
                disabled={disabled || loading}
              >
                <RefreshCw
                  className={cn('h-4 w-4 mr-2', loading && 'animate-spin')}
                />
                Actualizar
              </Button>
            )}

            {onExport && (
              <Button
                variant='outline'
                size='sm'
                onClick={onExport}
                disabled={disabled}
              >
                <Download className='h-4 w-4 mr-2' />
                Exportar
              </Button>
            )}

            {onSettings && (
              <Button
                variant='outline'
                size='sm'
                onClick={onSettings}
                disabled={disabled}
              >
                <Settings className='h-4 w-4' />
              </Button>
            )}
          </div>
        </div>

        {/* Lista de Gráficos */}
        <div className='space-y-3'>
          <h4 className='text-sm font-medium'>Gráficos Disponibles</h4>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            {charts.map((chart) => (
              <div
                key={chart.id}
                className={cn(
                  'flex items-center justify-between p-3 rounded-lg border',
                  chart.visible
                    ? 'bg-background border-border'
                    : 'bg-muted/50 border-muted'
                )}
              >
                <div className='flex items-center space-x-3'>
                  <div
                    className={cn(
                      'p-2 rounded',
                      chart.visible ? 'bg-primary/10' : 'bg-muted'
                    )}
                  >
                    {chart.icon}
                  </div>
                  <div>
                    <div className='text-sm font-medium'>{chart.title}</div>
                    <div className='text-xs text-muted-foreground'>
                      {chart.description}
                    </div>
                  </div>
                </div>

                <div className='flex items-center space-x-2'>
                  <Badge
                    variant={chart.visible ? 'default' : 'secondary'}
                    className='text-xs'
                  >
                    {chart.type}
                  </Badge>
                  <Switch
                    checked={chart.visible}
                    onCheckedChange={(checked) =>
                      handleChartToggle(chart.id, checked)
                    }
                    disabled={disabled}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Información de Configuración */}
        <div className='flex items-center justify-between text-xs text-muted-foreground pt-4 border-t'>
          <span>
            Gráficos visibles: {charts.filter((c) => c.visible).length} de{' '}
            {charts.length}
          </span>
          <span>
            Período:{' '}
            {PERIOD_OPTIONS.find((p) => p.value === selectedPeriod)?.label}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// COMPONENTE CON CONFIGURACIÓN POR DEFECTO
// ============================================================================

export function ChartControlsDefault() {
  const handlePeriodChange = React.useCallback((period: string) => {
    console.log('Period changed:', period);
  }, []);

  const handleChartToggle = React.useCallback(
    (chartId: string, visible: boolean) => {
      console.log('Chart toggled:', { chartId, visible });
    },
    []
  );

  const handleRefresh = React.useCallback(() => {
    console.log('Refreshing charts...');
  }, []);

  const handleExport = React.useCallback(() => {
    console.log('Exporting dashboard...');
  }, []);

  const handleSettings = React.useCallback(() => {
    console.log('Opening settings...');
  }, []);

  return (
    <ChartControls
      onPeriodChange={handlePeriodChange}
      onChartToggle={handleChartToggle}
      onRefresh={handleRefresh}
      onExport={handleExport}
      onSettings={handleSettings}
    />
  );
}
