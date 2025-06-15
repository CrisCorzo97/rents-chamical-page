import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <article className='flex flex-col gap-4'>
      <Breadcrumb className='mt-6 md:h-10'>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href='/' prefetch>
                Inicio
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbLink asChild>
            <Link href='/mis-pagos' prefetch>
              Mis Pagos
            </Link>
          </BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbLink asChild>
            <Link href='/mis-pagos/nuevo-pago' prefetch>
              Nuevo Pago
            </Link>
          </BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Instrucciones para el pago</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-12'>
        <Card className='md:col-span-12 2xl:col-span-10'>
          <CardHeader>
            <CardTitle className='text-lg font-medium'>
              Realiza el pago de la factura a la siguiente cuenta y adjunta el
              comprobante del mismo.
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='rounded-lg border bg-sky-100 p-4 space-y-2'>
              <div className='flex justify-between mb-4'>
                <span className='font-medium'>Nro de factura:</span>
                <Skeleton className='h-6 w-1/4 bg-muted-foreground' />
              </div>
              <div className='flex justify-between text-gray-500'>
                <span className='font-medium'>Importe seleccionado:</span>
                <Skeleton className='h-6 w-1/4 bg-muted-foreground' />
              </div>
              <div className='flex justify-between text-gray-500'>
                <span className='font-medium'>Intereses:</span>
                <Skeleton className='h-6 w-1/4 bg-muted-foreground' />
              </div>
              <div className='flex justify-between'>
                <span className='text-lg font-medium'>
                  Importe total a abonar:
                </span>
                <Skeleton className='h-6 w-1/4 bg-muted-foreground' />
              </div>
            </div>

            <div className='rounded-lg border bg-card p-4'>
              <div className='space-y-2'>
                <div className='flex justify-between'>
                  <span className='font-medium'>Banco:</span>
                  <Skeleton className='h-6 w-1/4' />
                </div>
                <div className='flex justify-between'>
                  <span className='font-medium'>CUIT:</span>
                  <Skeleton className='h-6 w-1/4' />
                </div>
                <div className='flex justify-between'>
                  <span className='font-medium'>Razón Social:</span>
                  <Skeleton className='h-6 w-1/4' />
                </div>
                <div className='flex justify-between'>
                  <span className='font-medium'>Nro de cuenta:</span>
                  <Skeleton className='h-6 w-1/4' />
                </div>
                <div className='flex justify-between'>
                  <span className='font-medium'>CBU:</span>
                  <Skeleton className='h-6 w-1/4' />
                </div>
                <div className='flex justify-between'>
                  <span className='font-medium'>Alias:</span>
                  <Skeleton className='h-6 w-1/4' />
                </div>
              </div>
            </div>

            <div className='space-y-2'>
              <Skeleton className='h-10 w-full' />
            </div>

            <CardFooter className='p-0 pt-4 flex justify-end'>
              <Skeleton className='h-10 w-24' />
            </CardFooter>
          </CardContent>
        </Card>
      </div>
    </article>
  );
}
