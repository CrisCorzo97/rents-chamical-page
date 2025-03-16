import { sortByToState } from '@/lib/table';
import { getAffidavits } from './actions';
import { affidavit_status } from '@prisma/client';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { AffidavitsClient } from './page.client';

export default async function AffidavitsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: number;
    items_per_page?: number;
    sort_by?: string;
    sort_direction?: string;
    filter?: string;
  }>;
}) {
  const { page, items_per_page, sort_by, sort_direction, filter } =
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

  const data = await getAffidavits({
    page,
    items_per_page,
    order_by,
    filter: {
      status: filter as affidavit_status | undefined,
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
            <BreadcrumbPage>DDJJ Realizadas</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <AffidavitsClient
        data={data}
        sorting={sortingState}
        filter={filter ?? ''}
      />
    </ScrollArea>
  );
}
