import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { PeriodSelectionCard } from '../components/period-selection-card';
import { getConceptsToPay } from '../services/invoices.actions';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nuevo Pago',
  description: 'Pago de impuestos y multas',
};

export default async function NewInvoicePage() {
  const { data: concepts } = await getConceptsToPay();

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
        <PeriodSelectionCard concepts={concepts ?? []} />
      </div>
    </div>
  );
}
