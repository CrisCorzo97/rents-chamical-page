import dbSupabase from '@/lib/prisma/prisma';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Envelope } from '@/types/envelope';
import { affidavit, Prisma } from '@prisma/client';
import { getPendingDeclarations, PeriodData } from '../lib';

export const getAffidavits = async (input: {
  page?: string;
  items_per_page?: string;
}) => {
  const response: Envelope<affidavit[]> = {
    success: true,
    data: null,
    error: null,
    pagination: null,
  };

  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (!user || error) {
      if (error) {
        throw new Error(error.message);
      }
      throw new Error('No se pudo obtener el usuario');
    }

    const queries: Prisma.affidavitFindManyArgs = {
      where: {
        AND: [
          { user: { id: user.id } },
          { declarable_tax_id: 'commercial_activity' },
        ],
      },
      orderBy: {
        created_at: 'desc',
      },
      take: 5,
    };

    if (input.page) {
      queries.skip = (+input.page - 1) * (queries.take ?? 5);
    }

    if (input.items_per_page) {
      queries.take = +input.items_per_page;
    }

    const [declarations, total_items] = await Promise.all([
      dbSupabase.affidavit.findMany(queries),
      dbSupabase.affidavit.count({
        where: queries.where,
      }),
    ]);

    response.data = declarations;
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

export const calculateUpcomingDueDates = async () => {
  const response: Envelope<PeriodData[]> = {
    success: true,
    data: null,
    error: null,
    pagination: null,
  };

  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (!user || error) {
      if (error) {
        throw new Error(error.message);
      }
      throw new Error('No se pudo obtener el usuario');
    }

    response.data = await getPendingDeclarations({
      declarableTaxId: 'commercial_activity',
      userId: user.id,
    });
  } catch (error) {
    console.error(error);
    response.success = false;

    if (error instanceof Error) {
      response.error = error.message;
    } else {
      response.error = 'Hubo un error al calcular las fechas de vencimiento';
    }
  } finally {
    return response;
  }
};
