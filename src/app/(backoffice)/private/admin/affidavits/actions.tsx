'use server';

import { Envelope, PaginationParams } from '@/types/envelope';
import { affidavit_status, Prisma } from '@prisma/client';
import { AffidavitsWithRelations } from './affidavits.interface';
import dbSupabase from '@/lib/prisma/prisma';
import { formatCuilInput } from '@/lib/formatters';

export const getAffidavits = async ({
  page,
  limit,
  sort_by,
  sort_direction,
  filters,
}: PaginationParams) => {
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
      take: limit ?? 8,
    };

    if (page) {
      queries.skip = (+page - 1) * (queries.take ?? 8);
    }

    if (filters) {
      const { status, tax_id, user } = filters;
      queries.where = {
        ...queries.where,
        ...(status && { status: status as affidavit_status }),
        ...(tax_id && {
          tax_id: {
            contains: formatCuilInput(tax_id as string),
          },
        }),
        ...(user && {
          user: {
            OR: [
              {
                first_name: {
                  contains: user as string,
                  mode: 'insensitive',
                },
              },
              {
                last_name: {
                  contains: user as string,
                  mode: 'insensitive',
                },
              },
            ],
          },
        }),
      };
    }

    if (sort_by) {
      queries.orderBy = {
        [sort_by]: sort_direction,
      };
    }

    const [affidavits, totalItems] = await Promise.all([
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
      totalPages: Math.ceil(totalItems / (queries.take ?? 8)),
      totalItems: totalItems,
      page: page ? +page : 1,
      limit: limit ?? 8,
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

export const getAffidavitsReport = async () => {
  const response: Envelope<AffidavitsWithRelations[]> = {
    success: true,
    data: null,
    error: null,
    pagination: null,
  };

  try {
    const affidavits: AffidavitsWithRelations[] = [];
    let currentAffidavits: typeof affidavits = [];

    do {
      currentAffidavits = await dbSupabase.affidavit.findMany({
        where: {
          declarable_tax_id: 'commercial_activity',
        },
        include: {
          user: true,
          invoice: true,
          declarable_tax: true,
        },
        orderBy: {
          created_at: 'desc',
        },
        take: 50,
        skip: affidavits.length,
      });

      affidavits.push(...currentAffidavits);
    } while (currentAffidavits.length > 0);

    response.data = affidavits;
  } catch (error) {
    console.error(error);
    response.success = false;
    response.error = 'Error al obtener las declaraciones';
  } finally {
    return response;
  }
};
