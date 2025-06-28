'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/cn';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; retry?: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  className?: string;
}

/**
 * Componente ErrorBoundary para capturar errores en componentes de gráficos
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Llamar callback personalizado si existe
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Usar fallback personalizado si se proporciona
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error}
            retry={this.handleRetry}
          />
        );
      }

      // Fallback por defecto
      return (
        <DefaultErrorFallback
          error={this.state.error}
          retry={this.handleRetry}
          className={this.props.className}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Componente de fallback por defecto para errores
 */
interface DefaultErrorFallbackProps {
  error?: Error;
  retry?: () => void;
  className?: string;
}

export function DefaultErrorFallback({
  error,
  retry,
  className,
}: DefaultErrorFallbackProps) {
  return (
    <Card className={cn('w-full border-destructive/20', className)}>
      <CardHeader className='pb-4'>
        <CardTitle className='flex items-center gap-2 text-destructive'>
          <AlertTriangle className='h-5 w-5' />
          Error al cargar el componente
        </CardTitle>
      </CardHeader>

      <CardContent className='space-y-4'>
        <div className='text-sm text-muted-foreground'>
          <p>Ha ocurrido un error inesperado al cargar este componente.</p>
          {error && (
            <details className='mt-2'>
              <summary className='cursor-pointer text-xs'>
                Ver detalles del error
              </summary>
              <pre className='mt-2 text-xs bg-muted p-2 rounded overflow-auto'>
                {error.message}
              </pre>
            </details>
          )}
        </div>

        {retry && (
          <Button
            onClick={retry}
            variant='outline'
            size='sm'
            className='w-full sm:w-auto'
          >
            <RefreshCw className='h-4 w-4 mr-2' />
            Reintentar
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Hook para manejar errores en componentes funcionales
 */
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  const handleError = React.useCallback((error: Error) => {
    console.error('Error caught by useErrorHandler:', error);
    setError(error);
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  return { error, handleError, clearError };
}

/**
 * Componente wrapper para manejar errores en componentes async
 */
interface AsyncErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; retry?: () => void }>;
  onError?: (error: Error) => void;
  className?: string;
}

export function AsyncErrorBoundary({
  children,
  fallback,
  onError,
  className,
}: AsyncErrorBoundaryProps) {
  const { error, handleError, clearError } = useErrorHandler();

  React.useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  if (error) {
    if (fallback) {
      const FallbackComponent = fallback;
      return <FallbackComponent error={error} retry={clearError} />;
    }

    return (
      <DefaultErrorFallback
        error={error}
        retry={clearError}
        className={className}
      />
    );
  }

  return (
    <ErrorBoundary
      fallback={fallback}
      onError={handleError}
      className={className}
    >
      {children}
    </ErrorBoundary>
  );
}

/**
 * Componente específico para errores en gráficos
 */
export function ChartErrorFallback({
  error,
  retry,
}: {
  error?: Error;
  retry?: () => void;
}) {
  return (
    <Card className='w-full border-destructive/20'>
      <CardHeader className='pb-4'>
        <CardTitle className='flex items-center gap-2 text-destructive'>
          <AlertTriangle className='h-5 w-5' />
          Error en el gráfico
        </CardTitle>
      </CardHeader>

      <CardContent className='space-y-4'>
        <div className='text-sm text-muted-foreground'>
          <p>No se pudo cargar el gráfico. Esto puede deberse a:</p>
          <ul className='list-disc list-inside mt-2 space-y-1'>
            <li>Problemas de conexión con la base de datos</li>
            <li>Datos insuficientes para generar el gráfico</li>
            <li>Error en el procesamiento de datos</li>
          </ul>
        </div>

        {retry && (
          <div className='flex gap-2'>
            <Button onClick={retry} variant='outline' size='sm'>
              <RefreshCw className='h-4 w-4 mr-2' />
              Reintentar
            </Button>
            <Button variant='ghost' size='sm'>
              Reportar problema
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
