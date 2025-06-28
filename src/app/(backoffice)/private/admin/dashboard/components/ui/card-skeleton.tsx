'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/cn';

interface CardSkeletonProps {
  title?: string;
  showIcon?: boolean;
  showTrend?: boolean;
  className?: string;
}

/**
 * Componente skeleton para cards de métricas
 */
export function CardSkeleton({
  title = 'Cargando...',
  showIcon = true,
  showTrend = false,
  className,
}: CardSkeletonProps) {
  return (
    <Card className={cn('h-52 flex flex-col justify-between', className)}>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <Skeleton className='h-6 w-32' />
        {showIcon && <Skeleton className='h-6 w-6 rounded' />}
      </CardHeader>

      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <Skeleton className='h-10 w-32' />
          {showTrend && (
            <div className='flex items-center space-x-2'>
              <Skeleton className='h-4 w-4 rounded-full' />
              <Skeleton className='h-4 w-20' />
            </div>
          )}
        </div>
      </CardContent>

      {showTrend && (
        <div className='px-6 pb-6'>
          <Skeleton className='h-8 w-full' />
        </div>
      )}
    </Card>
  );
}

/**
 * Grid de cards skeleton para el dashboard
 */
export function CardsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
}

/**
 * Skeleton específico para métricas financieras
 */
export function FinancialMetricsSkeleton() {
  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
      <CardSkeleton title='Total Recaudado' showTrend={true} />
      <CardSkeleton title='Total Pendiente' showTrend={true} />
      <CardSkeleton title='Total Multas' showTrend={false} />
      <CardSkeleton title='Habilitaciones' showTrend={false} />
      <CardSkeleton title='Propiedades' showTrend={false} />
      <CardSkeleton title='Cementerio' showTrend={false} />
    </div>
  );
}
