import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ScrollArea } from '@/components/ui/scroll-area';
import { sortByToState } from '@/lib/table';
import Link from 'next/link';
import { ReceiptClientPage } from './page.client';
import { getConfirmedReceipts } from './receipt-actions';

export default async function ReceiptPage({
  searchParams,
}: {
  searchParams: {
    page?: number;
    limit?: number;
    sort_by?: string;
    sort_direction?: string;
    filter?: string;
  };
}) {
  const { page, limit, sort_by, sort_direction, filter } = searchParams;

  let order_by = {};

  const sortingState = sortByToState({
    sort_by: sort_by ?? '',
    sort_direction: sort_direction ?? '',
  });

  if (sort_by && sort_direction) {
    order_by = {
      [sort_by]: sort_direction,
    };
  }

  const data = await getConfirmedReceipts({
    page,
    limit,
    order_by,
    filter: {
      taxpayer: {
        contains: filter?.toUpperCase() ?? '',
      },
    },
  });

  return (
    <ScrollArea className='mx-6 h-admin-scroll-area'>
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
          <BreadcrumbItem>Portal Administrativo</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Comprobantes</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <article>
        <h1 className='text-2xl font-bold'>Comprobantes de pago</h1>

        <ReceiptClientPage
          data={data}
          sorting={sortingState}
          filter={filter ?? ''}
        />
      </article>
    </ScrollArea>
  );
}
