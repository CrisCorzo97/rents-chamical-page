import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { CardBalance } from './components/card-balance';
import { CardStatus } from './components/card-status';
import { DueDateTable } from './components/due-date-table';
import Link from 'next/link';
import {
  getBalance,
  getPeriodsDueDate,
  validateOblea,
} from './services/overview.action';

export default async function ResumenPage() {
  const [
    { data: balance },
    { data: periodsDueDate, pagination },
    { canGenerate },
  ] = await Promise.all([getBalance(), getPeriodsDueDate(), validateOblea()]);

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
        <CardBalance balance={balance ?? 0} />

        <CardStatus canGenerate={canGenerate} />

        <DueDateTable items={periodsDueDate ?? []} pagination={pagination} />
      </div>
    </div>
  );
}
