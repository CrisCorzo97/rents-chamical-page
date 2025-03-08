import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { sortByToState } from '@/lib/table';
import Link from 'next/link';
import { PaymentHistoryClient } from './page.client';
import { getInvoices } from '../affidavit.actions';

export default async function PaymentHistoryPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: number;
    items_per_page?: number;
    sort_by?: string;
    sort_direction?: string;
    status?: string;
  }>;
}) {
  const { page, items_per_page, sort_by, sort_direction, status } =
    await searchParams;

  let order_by;

  const sortingState = sortByToState({
    sort_by: sort_by ?? '',
    sort_direction: sort_direction ?? '',
  });

  if (sort_by && sort_direction) {
    order_by = {
      [sort_by]: sort_direction,
    };
  }

  const data = await getInvoices({
    page,
    items_per_page,
    order_by,
    status: status as 'pending_payment' | 'paid' | 'defeated',
  });

  return (
    <article className='max-w-6xl mx-auto mb-8'>
      <section className='mx-6 h-admin-scroll-area'>
        <Breadcrumb className='h-12 mt-6'>
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
                <Link href='/tramites' prefetch>
                  Trámites
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href='/tramites/DDJJ-actividad-comercial' prefetch>
                  DDJJ Actividad Comercial
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Historial de Pagos</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <PaymentHistoryClient data={data} sorting={sortingState} />
      </section>
    </article>
  );
}
