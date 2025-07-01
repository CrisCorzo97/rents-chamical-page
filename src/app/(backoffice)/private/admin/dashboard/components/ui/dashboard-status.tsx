'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/cn';

// ============================================================================
// TIPOS
// ============================================================================

interface DashboardStatusProps {
  isLoading: boolean;
  isRefreshing: boolean;
  lastUpdated: Date | null;
  nextRefresh: Date | null;
  error: string | null;
  autoRefresh: boolean;
  refreshInterval: number;
  onRefresh?: () => void;
  onClearError?: () => void;
  className?: string;
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export function DashboardStatus({
  isLoading,
  isRefreshing,
  lastUpdated,
  nextRefresh,
  error,
  autoRefresh,
  refreshInterval,
  onRefresh,
  onClearError,
  className,
}: DashboardStatusProps) {
  const getStatusColor = () => {
    if (error) return 'destructive';
    if (isLoading || isRefreshing) return 'warning';
    return 'success';
  };

  const getStatusText = () => {
    if (error) return 'Error';
    if (isLoading) return 'Cargando';
    if (isRefreshing) return 'Actualizando';
    return 'Actualizado';
  };

  const getStatusIcon = () => {
    if (error) return <AlertTriangle className='h-4 w-4' />;
    if (isLoading || isRefreshing)
      return <RefreshCw className='h-4 w-4 animate-spin' />;
    return <CheckCircle className='h-4 w-4' />;
  };

  return (
    <Card className={cn('border-dashed', className)}>
      <CardContent className='p-4'>
        <div className='flex items-center justify-between'>
          {/* Estado actual */}
          <div className='flex items-center space-x-3'>
            <Badge
              variant={getStatusColor()}
              className='flex items-center space-x-1'
            >
              {getStatusIcon()}
              <span>{getStatusText()}</span>
            </Badge>

            {/* Información de última actualización */}
            <div className='text-sm text-muted-foreground'>
              {lastUpdated ? (
                <span>Actualizado: {lastUpdated.toLocaleTimeString()}</span>
              ) : (
                <span>Nunca actualizado</span>
              )}
            </div>
          </div>

          {/* Controles */}
          <div className='flex items-center space-x-2'>
            {/* Auto-refresh status */}
            <div className='flex items-center space-x-1 text-xs text-muted-foreground'>
              <Clock className='h-3 w-3' />
              <span>
                {autoRefresh
                  ? `Auto-refresh: ${refreshInterval / 60}min`
                  : 'Auto-refresh: OFF'}
              </span>
            </div>

            {/* Próxima actualización */}
            {autoRefresh && nextRefresh && (
              <div className='text-xs text-muted-foreground'>
                Próxima: {nextRefresh.toLocaleTimeString()}
              </div>
            )}

            {/* Botón de refresh */}
            {onRefresh && (
              <Button
                variant='outline'
                size='sm'
                onClick={onRefresh}
                disabled={isLoading || isRefreshing}
              >
                <RefreshCw
                  className={cn(
                    'h-3 w-3 mr-1',
                    (isLoading || isRefreshing) && 'animate-spin'
                  )}
                />
                Actualizar
              </Button>
            )}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className='mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-2'>
                <AlertTriangle className='h-4 w-4 text-destructive' />
                <span className='text-sm text-destructive'>{error}</span>
              </div>
              {onClearError && (
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={onClearError}
                  className='h-6 w-6 p-0'
                >
                  ×
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// COMPONENTE SIMPLIFICADO
// ============================================================================

export function DashboardStatusSimple({
  isLoading,
  isRefreshing,
  lastUpdated,
  error,
  onRefresh,
  className,
}: {
  isLoading: boolean;
  isRefreshing: boolean;
  lastUpdated: Date | null;
  error: string | null;
  onRefresh?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-between text-xs text-muted-foreground',
        className
      )}
    >
      <span>
        Última actualización:{' '}
        {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Nunca'}
      </span>

      <div className='flex items-center space-x-2'>
        {error && (
          <span className='text-destructive flex items-center space-x-1'>
            <AlertTriangle className='h-3 w-3' />
            <span>Error</span>
          </span>
        )}

        {(isLoading || isRefreshing) && (
          <span className='flex items-center space-x-1'>
            <RefreshCw className='h-3 w-3 animate-spin' />
            <span>Actualizando...</span>
          </span>
        )}

        {onRefresh && (
          <Button
            variant='ghost'
            size='sm'
            onClick={onRefresh}
            disabled={isLoading || isRefreshing}
            className='h-6 px-2'
          >
            <RefreshCw
              className={cn(
                'h-3 w-3',
                (isLoading || isRefreshing) && 'animate-spin'
              )}
            />
          </Button>
        )}
      </div>
    </div>
  );
}
