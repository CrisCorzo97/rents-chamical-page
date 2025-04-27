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
import { affidavit_status } from '@prisma/client';
import Link from 'next/link';
import { getInvoicesWithRelations } from './actions';
import { CollectionManagementClient } from './page.client';

export default async function CollectionManagementPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: number;
    limit?: number;
    sort_by?: string;
    sort_direction?: string;
    filter?: string;
  }>;
}) {
  const { page, limit, sort_by, sort_direction, filter } = await searchParams;

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

  const data = await getInvoicesWithRelations({
    page,
    items_per_page: limit,
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
            <BreadcrumbPage>Gestión de Cobranzas</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <CollectionManagementClient
        data={data}
        sorting={sortingState}
        filter={filter ?? ''}
      />
    </ScrollArea>
  );
}
