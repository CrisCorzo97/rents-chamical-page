import { Envelope, PaginationParams } from '@/types/envelope';
import { getTaxpayerData } from '../../lib/get-taxpayer-data';
import { dbSupabase } from '@/lib/prisma/prisma';
import { affidavit_status, Prisma } from '@prisma/client';
import { AffidavitWithRelations } from '../types/affidavits.types';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from 'dayjs';

dayjs.extend(customParseFormat);

export const getAffidavits = async ({
  page = 1,
  limit = 8,
  sort_by = 'created_at',
  sort_direction = 'desc',
  filters,
}: PaginationParams) => {
  const response: Envelope<AffidavitWithRelations[]> = {
    success: true,
    data: null,
    error: null,
    pagination: null,
  };

  try {
    const taxpayerData = await getTaxpayerData();

    const queries: Prisma.affidavitFindManyArgs = {
      where: {
        taxpayer_id: taxpayerData.user.id,
      },
      orderBy: {
        created_at: 'desc',
      },
      take: limit,
    };

    if (page) {
      queries.skip = (page - 1) * limit;
    }

    if (sort_by && sort_direction) {
      queries.orderBy = {
        [sort_by]: sort_direction,
      };
    }

    if (filters) {
      const { status } = filters;
      queries.where = {
        ...queries.where,
        status: status as affidavit_status,
      };
    }

    const [affidavits, total_items] = await Promise.all([
      dbSupabase.affidavit.findMany({
        ...queries,
        include: {
          declarable_tax: true,
          invoice: true,
        },
      }),
      dbSupabase.affidavit.count({
        where: {
          ...queries.where,
        },
      }),
    ]);

    response.data = affidavits;
    response.pagination = {
      page,
      limit,
      totalItems: total_items,
      totalPages: Math.ceil(total_items / limit),
    };
  } catch (error) {
    response.success = false;
    if (error instanceof Error) {
      response.error = error.message;
    } else {
      response.error = 'Error al obtener las declaraciones';
    }
  }

  return response;
};
