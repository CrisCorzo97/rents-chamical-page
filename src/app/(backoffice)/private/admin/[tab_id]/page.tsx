import { sortByToState } from '@/lib/table';
import { Envelope } from '@/types/envelope';
import { cementery, Prisma, property } from '@prisma/client';
import { getCementeryRecords, getProperties } from './actions';
import { CementeryRecordsTable } from './components/cementery-records-table/cementeryRecordsTable';
import { PropertyRecordsTable } from './components/properties-table/propertiesTable';

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

const ComponentDictionary: Record<
  string,
  ({ data, sortingState, filter }: any) => JSX.Element
> = {
  dashboard: PropertyRecordsTable<property>,
  property: PropertyRecordsTable<property>,
  cementery: CementeryRecordsTable<cementery>,
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
    <div className='mx-6'>
      {params.tab_id}
      <Component
        data={data}
        sortingState={sortingState}
        filter={searchParams.filter}
      />
    </div>
  );
}
