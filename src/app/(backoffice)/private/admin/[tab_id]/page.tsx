import { Envelope } from '@/types/envelope';
import { Prisma, property } from '@prisma/client';
import { getProperties } from './actions';
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
  const asyncFunctionDictionary: AsyncFunctionDictionary = {
    property: async function <T>(input: AsyncFunctionInput) {
      const data = await getProperties({
        page: input.page,
        limit: input.limit,
        order_by: input.order_by as Prisma.propertyOrderByWithRelationInput,
        filter: input.filter as Prisma.propertyWhereInput,
      });

      return data as Envelope<T[]>;
    },
  };

  const data = await asyncFunctionDictionary[params.tab_id]<property>(
    searchParams
  );

  return (
    <div>
      {params.tab_id}
      <PropertyTab data={data} />
    </div>
  );
}
