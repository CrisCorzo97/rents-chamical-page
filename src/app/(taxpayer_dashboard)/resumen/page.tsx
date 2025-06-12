import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { CardBalance, CardBalanceSkeleton } from './components/card-balance';
import { CardStatus, CardStatusSkeleton } from './components/card-status';
import {
  DueDateTable,
  DueDateTableSkeleton,
} from './components/due-date-table';
import Link from 'next/link';
import { Suspense } from 'react';
import {
  getBalance,
  getPeriodsDueDate,
  validateOblea,
} from './services/overview.action';

export default async function ResumenPage() {
  const balance = getBalance();
  const validateTaxpayerOblea = validateOblea();
  const periodsDueDate = getPeriodsDueDate();

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
            <BreadcrumbPage>Resumen</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-12'>
        {/* Card de Balance */}
        <Suspense fallback={<CardBalanceSkeleton />}>
          <CardBalance balance={balance} />
        </Suspense>

        {/* Card de Estado */}
        <Suspense fallback={<CardStatusSkeleton />}>
          <CardStatus validateOblea={validateTaxpayerOblea} />
        </Suspense>

        {/* Tabla de Próximos Vencimientos */}
        <Suspense fallback={<DueDateTableSkeleton />}>
          <DueDateTable periodsDueDate={periodsDueDate} />
        </Suspense>
      </div>
    </div>
  );
}
