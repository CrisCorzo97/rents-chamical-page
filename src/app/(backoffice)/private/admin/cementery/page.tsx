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
import { getCementeryRecords } from './actions.cementery';
import { CementeryPageClient } from './page.client';

export default async function CementeryPage({
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

  const data = await getCementeryRecords({
    page,
    limit,
    order_by,
    filter: {
      OR: [
        {
          taxpayer: {
            contains: filter?.toUpperCase() ?? '',
          },
        },
        {
          deceased_name: {
            contains: filter?.toUpperCase() ?? '',
          },
        },
      ],
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
            <BreadcrumbPage>Cementerio</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <CementeryPageClient
        data={data}
        sorting={sortingState}
        filter={filter ?? ''}
      />
    </ScrollArea>
  );
}
