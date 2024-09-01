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
import { Envelope } from '@/types/envelope';
import { Prisma } from '@prisma/client';
import { SortingState } from '@tanstack/react-table';
import Link from 'next/link';
import { getCementeryRecords, getProperties } from './actions';
import { CementeryRecordsTable } from './components/cementery-records-table/cementeryRecordsTable';
import { PropertyRecordsTable } from './components/property-records-table/propertyRecordsTable';

interface AsyncFunctionDictionary {
  [key: string]: <T>(input: AsyncFunctionInput) => Promise<Envelope<T[]>>;
}

type AsyncFunctionInput = {
  page?: number;
  limit?: number;
  order_by?: {
    [key: string]: string;
  };
  filter?: string;
};

const asyncFunctionDictionary: AsyncFunctionDictionary = {
  dashboard: async function <T>(input: AsyncFunctionInput) {
    const data = await getProperties({
      page: input.page,
      limit: input.limit,
      order_by: input.order_by as Prisma.propertyOrderByWithRelationInput,
      filter: input.filter as Prisma.propertyWhereInput,
    });

    return data as Envelope<T[]>;
  },
  property: async function <T>(input: AsyncFunctionInput) {
    const data = await getProperties({
      page: input.page,
      limit: input.limit,
      order_by: input.order_by as Prisma.propertyOrderByWithRelationInput,
      filter: {
        taxpayer: {
          contains: input.filter,
        },
      },
    });

    return data as Envelope<T[]>;
  },
  cementery: async function <T>(input: AsyncFunctionInput) {
    const data = await getCementeryRecords({
      page: input.page,
      limit: input.limit,
      order_by: input.order_by as Prisma.cementeryOrderByWithRelationInput,
      filter: {
        taxpayer: {
          contains: input.filter,
        },
      },
    });

    return data as Envelope<T[]>;
  },
};

export type ComponentProps<T> = {
  data: Envelope<T[]>;
  sorting: SortingState;
  filter: string;
};

const ComponentDictionary: Record<
  string,
  <T>(props: ComponentProps<T>) => JSX.Element
> = {
  dashboard: PropertyRecordsTable,
  property: PropertyRecordsTable,
  cementery: CementeryRecordsTable,
};

const TAB_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  property: 'Propiedades',
  cementery: 'Cementerio',
};

export default async function TabContentPage({
  params,
  searchParams,
}: {
  params: {
    tab_id: string;
  };
  searchParams: {
    page?: number;
    limit?: number;
    sort_by?: string;
    sort_direction?: string;
    filter?: string;
    record_id?: string;
  };
}) {
  let sorted_by = {};

  const sortingState = sortByToState({
    sort_by: searchParams.sort_by ?? '',
    sort_direction: searchParams.sort_direction ?? '',
  });

  if (searchParams.sort_by && searchParams.sort_direction) {
    sorted_by = {
      [searchParams.sort_by]: searchParams.sort_direction,
    };
  }

  const data = await asyncFunctionDictionary[params.tab_id]({
    ...searchParams,
    order_by: sorted_by,
  });

  const Component = ComponentDictionary[params.tab_id];

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
            <BreadcrumbPage>{TAB_LABELS[params.tab_id]}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Component
        data={data}
        sorting={sortingState ?? []}
        filter={searchParams.filter ?? ''}
      />
    </ScrollArea>
  );
}
