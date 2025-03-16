import { Envelope } from '@/types/envelope';
import { Prisma } from '@prisma/client';
import { AffidavitsWithRelations } from './affidavits.interface';
import dbSupabase from '@/lib/prisma/prisma';

export const getAffidavits = async (input: {
  page?: number;
  items_per_page?: number;
  filter?: Prisma.affidavitWhereInput;
  order_by?: Prisma.affidavitOrderByWithRelationInput;
}) => {
  const response: Envelope<AffidavitsWithRelations[]> = {
    success: true,
    data: null,
    error: null,
    pagination: null,
  };

  try {
    const queries: Prisma.affidavitFindManyArgs = {
      where: {
        declarable_tax_id: 'commercial_activity',
      },
      orderBy: {
        created_at: 'desc',
      },
      take: 5,
    };

    if (input.items_per_page) {
      queries.take = +input.items_per_page;
    }

    if (input.page) {
      queries.skip = (+input.page - 1) * (queries.take ?? 5);
    }

    if (input.filter) {
      queries.where = {
        ...queries.where,
        ...input.filter,
      };
    }

    if (input.order_by) {
      queries.orderBy = input.order_by;
    }

    const [affidavits, total_items] = await Promise.all([
      dbSupabase.affidavit.findMany({
        ...queries,
        include: {
          user: true,
          invoice: true,
          declarable_tax: true,
        },
      }),
      dbSupabase.affidavit.count({
        where: queries.where,
      }),
    ]);

    response.data = affidavits;
    response.pagination = {
      total_pages: Math.ceil(total_items / (queries.take ?? 5)),
      total_items,
      page: input.page ? +input.page : 1,
      limit_per_page: queries.take ?? 5,
    };
  } catch (error) {
    console.error(error);
    response.success = false;

    if (error instanceof Error) {
      response.error = error.message;
    } else {
      response.error = 'Hubo un error al obtener las declaraciones';
    }
  } finally {
    return response;
  }
};
