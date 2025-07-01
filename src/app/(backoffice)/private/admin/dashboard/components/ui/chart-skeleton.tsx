'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/cn';

interface ChartSkeletonProps {
  title?: string;
  subtitle?: string;
  showLegend?: boolean;
  height?: number;
  className?: string;
}

/**
 * Componente skeleton para gráficos
 */
export function ChartSkeleton({
  title = 'Cargando gráfico...',
  subtitle,
  showLegend = true,
  height = 300,
  className,
}: ChartSkeletonProps) {
  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className='pb-4'>
        <div className='space-y-2'>
          <Skeleton className='h-6 w-48' />
          {subtitle && <Skeleton className='h-4 w-32' />}
        </div>
      </CardHeader>

      <CardContent className='space-y-4'>
        {/* Área del gráfico */}
        <div
          className='relative w-full bg-muted/20 rounded-lg overflow-hidden'
          style={{ height: `${height}px` }}
        >
          {/* Líneas de grid simuladas */}
          <div className='absolute inset-0 flex flex-col justify-between p-4'>
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className='border-b border-muted/30' />
            ))}
          </div>

          {/* Elementos del gráfico simulados */}
          <div className='absolute inset-0 p-4'>
            <div className='h-full flex items-end space-x-2'>
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className='flex-1 bg-muted/40 rounded-t animate-pulse'
                  style={{
                    height: `${Math.random() * 60 + 20}%`,
                    animationDelay: `${index * 100}ms`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Leyenda */}
        {showLegend && (
          <div className='flex flex-wrap gap-4 justify-center'>
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className='flex items-center space-x-2'>
                <Skeleton className='h-3 w-3 rounded-full' />
                <Skeleton className='h-4 w-16' />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Skeleton específico para gráfico de línea (timeline)
 */
export function LineChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <Card className='w-full'>
      <CardHeader className='pb-4'>
        <CardTitle>
          <Skeleton className='h-6 w-48' />
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div
          className='relative w-full bg-muted/20 rounded-lg overflow-hidden'
          style={{ height: `${height}px` }}
        >
          {/* Líneas de grid */}
          <div className='absolute inset-0 flex flex-col justify-between p-4'>
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className='border-b border-muted/30' />
            ))}
          </div>

          {/* Línea del gráfico simulada */}
          <div className='absolute inset-0 p-4'>
            <svg
              className='w-full h-full'
              viewBox='0 0 100 100'
              preserveAspectRatio='none'
            >
              <path
                d='M 0,80 Q 20,60 40,70 T 80,40 T 100,20'
                fill='none'
                stroke='hsl(var(--muted-foreground))'
                strokeWidth='2'
                strokeDasharray='5,5'
                opacity='0.3'
              />
            </svg>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Skeleton específico para gráfico de pie/donut
 */
export function PieChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <Card className='w-full'>
      <CardHeader className='pb-4'>
        <CardTitle>
          <Skeleton className='h-6 w-48' />
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className='flex flex-col lg:flex-row items-center gap-6'>
          {/* Círculo del gráfico */}
          <div
            className='relative bg-muted/20 rounded-full flex items-center justify-center'
            style={{ width: `${height * 0.6}px`, height: `${height * 0.6}px` }}
          >
            <div className='w-3/4 h-3/4 bg-muted/40 rounded-full animate-pulse' />
          </div>

          {/* Leyenda */}
          <div className='flex flex-col gap-3'>
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className='flex items-center space-x-3'>
                <Skeleton className='h-4 w-4 rounded-full' />
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-4 w-12' />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Skeleton específico para gráfico de barras
 */
export function BarChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <Card className='w-full'>
      <CardHeader className='pb-4'>
        <CardTitle>
          <Skeleton className='h-6 w-48' />
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div
          className='relative w-full bg-muted/20 rounded-lg overflow-hidden'
          style={{ height: `${height}px` }}
        >
          {/* Líneas de grid */}
          <div className='absolute inset-0 flex flex-col justify-between p-4'>
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className='border-b border-muted/30' />
            ))}
          </div>

          {/* Barras simuladas */}
          <div className='absolute inset-0 p-4'>
            <div className='h-full flex items-end space-x-3'>
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className='flex-1 flex flex-col items-center space-y-2'
                >
                  <div
                    className='w-full bg-muted/40 rounded-t animate-pulse'
                    style={{
                      height: `${Math.random() * 70 + 20}%`,
                      animationDelay: `${index * 150}ms`,
                    }}
                  />
                  <Skeleton className='h-3 w-8' />
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Skeleton específico para gráfico de área
 */
export function AreaChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <Card className='w-full'>
      <CardHeader className='pb-4'>
        <CardTitle>
          <Skeleton className='h-6 w-48' />
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div
          className='relative w-full bg-muted/20 rounded-lg overflow-hidden'
          style={{ height: `${height}px` }}
        >
          {/* Líneas de grid */}
          <div className='absolute inset-0 flex flex-col justify-between p-4'>
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className='border-b border-muted/30' />
            ))}
          </div>

          {/* Área del gráfico simulada */}
          <div className='absolute inset-0 p-4'>
            <svg
              className='w-full h-full'
              viewBox='0 0 100 100'
              preserveAspectRatio='none'
            >
              <path
                d='M 0,80 Q 20,60 40,70 T 80,40 T 100,20 L 100,100 L 0,100 Z'
                fill='hsl(var(--muted-foreground))'
                opacity='0.1'
              />
              <path
                d='M 0,80 Q 20,60 40,70 T 80,40 T 100,20'
                fill='none'
                stroke='hsl(var(--muted-foreground))'
                strokeWidth='2'
                opacity='0.3'
              />
            </svg>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
