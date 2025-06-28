'use client';

import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

// ============================================================================
// TIPOS DE ERROR
// ============================================================================

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function DashboardError({ error, reset }: ErrorProps) {
  return (
    <div className='min-h-screen flex items-center justify-center p-6'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10'>
            <AlertTriangle className='h-6 w-6 text-destructive' />
          </div>
          <CardTitle className='text-xl text-destructive'>
            Error en el Dashboard
          </CardTitle>
        </CardHeader>

        <CardContent className='space-y-4'>
          <div className='text-center space-y-2'>
            <p className='text-sm text-muted-foreground'>
              Ha ocurrido un error inesperado al cargar el dashboard
              administrativo.
            </p>

            {error.message && (
              <div className='bg-muted/50 p-3 rounded-lg'>
                <p className='text-xs font-mono text-muted-foreground break-all'>
                  {error.message}
                </p>
                {error.digest && (
                  <p className='text-xs text-muted-foreground mt-1'>
                    ID: {error.digest}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className='flex flex-col space-y-2'>
            <Button onClick={reset} className='w-full' variant='outline'>
              <RefreshCw className='h-4 w-4 mr-2' />
              Reintentar
            </Button>

            <Button asChild className='w-full' variant='outline'>
              <Link href='/admin'>
                <Home className='h-4 w-4 mr-2' />
                Volver al Inicio
              </Link>
            </Button>
          </div>

          <div className='text-center'>
            <p className='text-xs text-muted-foreground'>
              Si el problema persiste, contacta al administrador del sistema.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
