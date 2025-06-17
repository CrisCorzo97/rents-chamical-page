import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card';
import { TableSkeleton } from '@/components/custom-table/table-skeleton';

export default function Loading() {
  // Or a custom loading skeleton component
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
          <BreadcrumbLink asChild>
            <Link href='/mis-pagos' prefetch>
              Mis Pagos
            </Link>
          </BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Nuevo Pago</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-12'>
        <Card className='md:col-span-12 2xl:col-span-10'>
          <CardHeader>
            <CardTitle className='text-lg font-medium'>
              Selecciona los conceptos a pagar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TableSkeleton columns={4} rows={5} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
