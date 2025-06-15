import {
  Alert,
  AlertDescription,
  AlertTitle,
  Label,
  FormItem,
} from '@/components/ui';
import {
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Info } from 'lucide-react';
import Link from 'next/link';

export default function Loading() {
  return (
    <div className='flex flex-col gap-4'>
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
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href='/mis-declaraciones' prefetch>
                Mis Declaraciones
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Nueva Declaración</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-12'>
        <Card className='md:col-span-12 flex flex-col gap-2 2xl:col-span-10'>
          <CardHeader>
            <CardTitle className='text-2xl font-bold '>
              Nueva Declaración
            </CardTitle>
            <CardDescription
              className='text-lg
                '
            >
              <b>Período:</b>{' '}
              <Skeleton className='h-6 w-1/4 bg-muted-foreground' />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className='bg-blue-100 border-blue-600 2xl:col-span-10'>
              <Info className='text-blue-600 mt-2' size={16} />
              <AlertTitle className='text-lg'>
                Información sobre la escala de montos a pagar
              </AlertTitle>
              <AlertDescription>
                <strong>
                  Bancos - Entidades Financieras - Compañías Financieras
                </strong>
                <ul className='list-disc list-inside ml-4 mb-2'>
                  <li>
                    Cálculo de Base por Alícuota única <b>(0,5%)</b>
                  </li>
                </ul>
                <strong>Comercios - Servicios - Industrias</strong>
                <ul className='list-disc list-inside ml-4 mb-2'>
                  <li>
                    De $0 a $5.000.000: <b>$7.500</b>
                  </li>
                  <li>
                    Mayor a $5.000.000 y hasta $10.000.000: <b>$11.250</b>
                  </li>
                  <li>
                    Mayor a $10.000.000 y hasta $20.000.000: <b>$16.875</b>
                  </li>
                  <li>
                    Mayor a $20.000.000 y hasta $35.000.000: <b>$25.312,50</b>
                  </li>
                  <li>
                    Mayor a $35.000.000 y hasta $50.000.000: <b>$37.968,75</b>
                  </li>
                  <li>
                    Mayor a $50.000.000 y hasta $100.000.000: <b>$56.953,13</b>
                  </li>
                  <li>
                    Mayor a $100.000.000 y hasta $200.000.000: <b>$85.429,69</b>
                  </li>
                  <li>
                    Mayor a $200.000.000: <b>$128.144,53</b>
                  </li>
                </ul>
                <p>
                  Cabe destacar que la tasa mínima a abonar es de <b>$7.500</b>
                </p>
                <p className='mt-2'>
                  Podés revisar los detalles de cada tramo en la{' '}
                  <Link
                    target='_blank'
                    className='underline text-blue-600 font-semibold'
                    href='https://fjksfkvauwungomvrlhm.supabase.co/storage/v1/object/public/documents//Ordenanza%20Nro%20552%20Tributaria%20Impositiva.pdf'
                  >
                    Ordenanza Nro 552
                  </Link>
                </p>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card className='md:col-span-12 2xl:col-span-10 '>
          <CardHeader>
            <CardTitle className='text-lg font-medium'>
              <Skeleton className='h-6 w-1/4 bg-muted-foreground' />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className='grid grid-cols-5 space-y-5'>
              <div className='col-span-5 grid grid-cols-5 gap-4'>
                <FormItem className='space-y-2'>
                  <Label>Período</Label>
                  <Skeleton className='h-10 w-full bg-muted-foreground' />
                </FormItem>
                <FormItem className='space-y-2'>
                  <Label>Base Imponible</Label>
                  <Skeleton className='h-10 w-full bg-muted-foreground' />
                </FormItem>
                <FormItem className='space-y-2'>
                  <Label>Tasa Determinada</Label>
                  <Skeleton className='h-10 w-full bg-muted-foreground' />
                </FormItem>
                <FormItem className='space-y-2 flex items-end'>
                  <Skeleton className='h-10 w-full bg-muted-foreground' />
                </FormItem>
              </div>

              <div className='col-span-5 mt-4 pt-4 border-t'>
                <div className='flex justify-end items-center gap-4'>
                  <Label className='text-lg font-semibold'>
                    Tasa Determinada Total:
                  </Label>
                  <Skeleton className='h-10 w-full bg-muted-foreground' />
                </div>
              </div>

              <Skeleton className='h-10 w-full col-start-5 bg-muted-foreground' />
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
