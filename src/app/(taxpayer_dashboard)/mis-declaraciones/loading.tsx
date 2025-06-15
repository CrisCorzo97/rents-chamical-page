import Link from 'next/link';
import { AffidavitsTableSkeleton } from './components/affidavits-table';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Skeleton } from '@/components/ui/skeleton';

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
          <BreadcrumbItem>
            <BreadcrumbPage>Mis Declaraciones</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-12'>
        <div className='md:col-span-12 2xl:col-span-10 flex justify-end'>
          <Skeleton className='h-10 w-full md:w-36 bg-muted-foreground' />
        </div>

        <AffidavitsTableSkeleton />
      </div>
    </div>
  );
}
