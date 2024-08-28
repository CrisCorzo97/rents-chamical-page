import { Envelope } from '@/types/envelope';
import { Prisma } from '@prisma/client';
import { getCementeryRecords, getProperties } from './actions';
import { CementeryTab } from './components/cementeryTab';
import { PropertyTab } from './properties/page';

interface AsyncFunctionDictionary {
  [key: string]: <T>(input: AsyncFunctionInput) => Promise<Envelope<T[]>>;
}

type AsyncFunctionInput = {
  page?: number;
  limit?: number;
  order_by?: string;
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
    const data = await getCementeryRecords({
      page: input.page,
      limit: input.limit,
      order_by: input.order_by as Prisma.cementeryOrderByWithRelationInput,
      filter: input.filter as Prisma.cementeryWhereInput,
    });

    return data as Envelope<T[]>;
  },
  cementery: async function <T>(input: AsyncFunctionInput) {
    const data = await getProperties({
      page: input.page,
      limit: input.limit,
      order_by: input.order_by as Prisma.propertyOrderByWithRelationInput,
      filter: input.filter as Prisma.propertyWhereInput,
    });

    return data as Envelope<T[]>;
  },
};

const ComponentDictionary: Record<string, ({ data }: any) => JSX.Element> = {
  dashboard: PropertyTab,
  property: PropertyTab,
  cementery: CementeryTab,
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
    order_by?: string;
    filter?: string;
  };
}) {
  const data = await asyncFunctionDictionary[params.tab_id](searchParams);

  const Component = ComponentDictionary[params.tab_id];

  return (
    <div>
      {params.tab_id}
      <Component data={data} />
    </div>
  );
}
