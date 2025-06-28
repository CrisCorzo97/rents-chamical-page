import { RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// ============================================================================
// COMPONENTE DE LOADING PRINCIPAL
// ============================================================================

export default function DashboardLoading() {
  return (
    <div className='space-y-6 p-6'>
      {/* Header Loading */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <Skeleton className='h-8 w-64' />
          <div className='flex items-center space-x-2'>
            <Skeleton className='h-5 w-5 rounded-full' />
            <Skeleton className='h-4 w-20' />
          </div>
        </div>

        <div className='flex items-center space-x-2'>
          <Skeleton className='h-9 w-20' />
          <Skeleton className='h-9 w-9' />
        </div>
      </div>

      {/* Info Loading */}
      <div className='flex items-center justify-between'>
        <Skeleton className='h-4 w-48' />
        <Skeleton className='h-4 w-32' />
      </div>

      {/* Métricas Financieras Loading */}
      <section className='space-y-4'>
        <div className='flex items-center space-x-2'>
          <Skeleton className='h-5 w-5 rounded-full' />
          <Skeleton className='h-6 w-48' />
        </div>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className='h-52'>
              <CardContent className='p-6'>
                <div className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <Skeleton className='h-4 w-24' />
                    <Skeleton className='h-4 w-4 rounded-full' />
                  </div>
                  <Skeleton className='h-8 w-32' />
                  <Skeleton className='h-3 w-16' />
                  <div className='flex items-center space-x-2'>
                    <Skeleton className='h-3 w-3 rounded-full' />
                    <Skeleton className='h-4 w-12' />
                    <Skeleton className='h-3 w-20' />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Gráficos Principales Loading */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} className='h-[500px]'>
            <CardContent className='p-6'>
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <div className='space-y-2'>
                    <Skeleton className='h-5 w-40' />
                    <Skeleton className='h-3 w-32' />
                  </div>
                  <Skeleton className='h-4 w-4 rounded-full' />
                </div>
                <div className='flex items-center justify-center h-80'>
                  <div className='flex flex-col items-center space-y-4'>
                    <RefreshCw className='h-8 w-8 animate-spin text-muted-foreground' />
                    <div className='text-center'>
                      <Skeleton className='h-4 w-32 mb-2' />
                      <Skeleton className='h-3 w-48' />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráficos Secundarios Loading */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} className='h-[500px]'>
            <CardContent className='p-6'>
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <div className='space-y-2'>
                    <Skeleton className='h-5 w-40' />
                    <Skeleton className='h-3 w-32' />
                  </div>
                  <Skeleton className='h-4 w-4 rounded-full' />
                </div>
                <div className='flex items-center justify-center h-80'>
                  <div className='flex flex-col items-center space-y-4'>
                    <RefreshCw className='h-8 w-8 animate-spin text-muted-foreground' />
                    <div className='text-center'>
                      <Skeleton className='h-4 w-32 mb-2' />
                      <Skeleton className='h-3 w-48' />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Controles Loading */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} className='border-dashed'>
            <CardContent className='p-6'>
              <div className='space-y-4'>
                <Skeleton className='h-5 w-32' />
                <div className='space-y-3'>
                  <Skeleton className='h-10 w-full' />
                  <Skeleton className='h-10 w-full' />
                  <Skeleton className='h-10 w-full' />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
