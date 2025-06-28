'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Settings, RefreshCw, Download, Eye, Calendar } from 'lucide-react';

// ============================================================================
// TIPOS
// ============================================================================

interface DashboardSettingsProps {
  autoRefresh: boolean;
  refreshInterval: number;
  selectedPeriod: 'daily' | 'weekly' | 'monthly' | 'yearly';
  visibleCharts: {
    financialMetrics: boolean;
    revenueTimeline: boolean;
    revenueDistribution: boolean;
    declarationStatus: boolean;
    cashFlow: boolean;
  };
  onAutoRefreshChange: (enabled: boolean) => void;
  onRefreshIntervalChange: (interval: number) => void;
  onPeriodChange: (period: 'daily' | 'weekly' | 'monthly' | 'yearly') => void;
  onChartVisibilityChange: (chartId: string, visible: boolean) => void;
  onRefresh: () => void;
  onExport: () => void;
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export function DashboardSettings({
  autoRefresh,
  refreshInterval,
  selectedPeriod,
  visibleCharts,
  onAutoRefreshChange,
  onRefreshIntervalChange,
  onPeriodChange,
  onChartVisibilityChange,
  onRefresh,
  onExport,
}: DashboardSettingsProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const refreshIntervals = [
    { value: 60, label: '1 minuto' },
    { value: 300, label: '5 minutos' },
    { value: 600, label: '10 minutos' },
    { value: 1800, label: '30 minutos' },
    { value: 3600, label: '1 hora' },
  ];

  const periods = [
    { value: 'daily', label: 'Diario' },
    { value: 'weekly', label: 'Semanal' },
    { value: 'monthly', label: 'Mensual' },
    { value: 'yearly', label: 'Anual' },
  ];

  const charts = [
    { id: 'financialMetrics', label: 'Métricas Financieras', icon: '💰' },
    { id: 'revenueTimeline', label: 'Evolución de Ingresos', icon: '📈' },
    {
      id: 'revenueDistribution',
      label: 'Distribución de Ingresos',
      icon: '🥧',
    },
    { id: 'declarationStatus', label: 'Estado de Declaraciones', icon: '📊' },
    { id: 'cashFlow', label: 'Flujo de Caja', icon: '💸' },
  ];

  return (
    <div className='relative'>
      {/* Botón de configuración */}
      <Button
        variant='outline'
        size='sm'
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center space-x-2'
      >
        <Settings className='h-4 w-4' />
        <span>Configuración</span>
      </Button>

      {/* Panel de configuración */}
      {isOpen && (
        <Card className='absolute right-0 top-12 w-80 z-50 shadow-lg'>
          <CardHeader className='pb-3'>
            <CardTitle className='text-lg flex items-center space-x-2'>
              <Settings className='h-5 w-5' />
              <span>Configuración del Dashboard</span>
            </CardTitle>
          </CardHeader>

          <CardContent className='space-y-4'>
            {/* Auto-refresh */}
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <Label className='flex items-center space-x-2'>
                  <RefreshCw className='h-4 w-4' />
                  <span>Auto-refresh</span>
                </Label>
                <Switch
                  checked={autoRefresh}
                  onCheckedChange={onAutoRefreshChange}
                />
              </div>

              {autoRefresh && (
                <div className='space-y-2'>
                  <Label className='text-sm text-muted-foreground'>
                    Intervalo de actualización
                  </Label>
                  <Select
                    value={refreshInterval.toString()}
                    onValueChange={(value) =>
                      onRefreshIntervalChange(parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {refreshIntervals.map((interval) => (
                        <SelectItem
                          key={interval.value}
                          value={interval.value.toString()}
                        >
                          {interval.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <Separator />

            {/* Período de datos */}
            <div className='space-y-2'>
              <Label className='flex items-center space-x-2'>
                <Calendar className='h-4 w-4' />
                <span>Período de datos</span>
              </Label>
              <Select
                value={selectedPeriod}
                onValueChange={(
                  value: 'daily' | 'weekly' | 'monthly' | 'yearly'
                ) => onPeriodChange(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {periods.map((period) => (
                    <SelectItem key={period.value} value={period.value}>
                      {period.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Visibilidad de gráficos */}
            <div className='space-y-3'>
              <Label className='flex items-center space-x-2'>
                <Eye className='h-4 w-4' />
                <span>Gráficos visibles</span>
              </Label>

              <div className='space-y-2'>
                {charts.map((chart) => (
                  <div
                    key={chart.id}
                    className='flex items-center justify-between'
                  >
                    <div className='flex items-center space-x-2'>
                      <span>{chart.icon}</span>
                      <span className='text-sm'>{chart.label}</span>
                    </div>
                    <Switch
                      checked={
                        visibleCharts[chart.id as keyof typeof visibleCharts]
                      }
                      onCheckedChange={(checked) =>
                        onChartVisibilityChange(chart.id, checked)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Acciones rápidas */}
            <div className='space-y-2'>
              <Label className='text-sm font-medium'>Acciones rápidas</Label>
              <div className='flex space-x-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={onRefresh}
                  className='flex-1'
                >
                  <RefreshCw className='h-4 w-4 mr-2' />
                  Actualizar
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={onExport}
                  className='flex-1'
                >
                  <Download className='h-4 w-4 mr-2' />
                  Exportar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
