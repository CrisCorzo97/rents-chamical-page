'use server';
import dbSupabase from '@/lib/prisma/prisma';
import { Envelope } from '@/types/envelope';
import {
  city_section,
  commercial_activity,
  commercial_enablement,
  neighborhood,
  Prisma,
} from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { CommercialEnablementWithRelations } from './commercial_enablement.interface';

export const getCommercialEnablementById = async (
  id: string
): Promise<CommercialEnablementWithRelations | null> => {
  const commercialEnablementRecord =
    await dbSupabase.commercial_enablement.findUnique({
      where: { id },
      include: {
        city_section: true,
        neighborhood: true,
        commercial_activity: true,
        commercial_activity_commercial_enablement_second_commercial_activity_idTocommercial_activity:
          true,
        commercial_activity_commercial_enablement_third_commercial_activity_idTocommercial_activity:
          true,
      },
    });

  return commercialEnablementRecord;
};

interface GetComercialEnablementsParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
  filters?: Record<string, string>;
}

export async function getComercialEnablements({
  page = 1,
  limit = 8,
  sort_by,
  sort_direction,
  filters,
}: GetComercialEnablementsParams): Promise<
  Envelope<CommercialEnablementWithRelations[]>
> {
  const response: Envelope<CommercialEnablementWithRelations[]> = {
    success: true,
    data: [],
    error: null,
    pagination: null,
  };

  try {
    const queries: Prisma.commercial_enablementFindManyArgs = {
      orderBy: {
        taxpayer: 'desc',
      },
      take: limit ?? 8,
    };

    if (page) {
      queries.skip = (+page - 1) * (queries.take ?? 8);
    }

    if (filters) {
      const { taxpayer, company_name } = filters;
      queries.where = {
        ...queries.where,
        ...(taxpayer && { taxpayer: taxpayer as string }),
        ...(company_name && { company_name: company_name as string }),
      };
    }

    if (sort_by) {
      queries.orderBy = {
        [sort_by]: sort_direction ?? 'desc',
      };
    }

    const [total, items] = await Promise.all([
      dbSupabase.commercial_enablement.count({ where: queries.where }),
      dbSupabase.commercial_enablement.findMany({
        ...queries,
        include: {
          commercial_activity: true,
          commercial_activity_commercial_enablement_second_commercial_activity_idTocommercial_activity:
            true,
          commercial_activity_commercial_enablement_third_commercial_activity_idTocommercial_activity:
            true,
          neighborhood: true,
          city_section: true,
        },
      }),
    ]);

    response.data = items;
    response.pagination = {
      totalItems: total,
      page,
      limit,
      totalPages: Math.ceil(total / (limit ?? 8)),
    };
  } catch (error) {
    console.error({ error });

    response.success = false;
    response.error =
      'Hubo un error al obtener los registros de habilitaciones comerciales.';
  } finally {
    return response;
  }
}

export const createCommercialEnablement = async (
  input: Prisma.commercial_enablementCreateInput
): Promise<Envelope<commercial_enablement['id']>> => {
  const response: Envelope<commercial_enablement['id']> = {
    success: true,
    data: null,
    error: null,
    pagination: null,
  };

  try {
    const newCommercialEnablement =
      await dbSupabase.commercial_enablement.create({ data: input });

    response.data = newCommercialEnablement.id;

    revalidatePath('/private/admin/commercial_enablement');
  } catch (error) {
    console.error(error);
    response.success = false;
    response.error = 'Error al crear el registro de habilitación comercial';
  } finally {
    return response;
  }
};

export const updateCommercialEnablement = async (
  args: Prisma.commercial_enablementUpdateArgs
): Promise<Envelope<commercial_enablement['id']>> => {
  const response: Envelope<commercial_enablement['id']> = {
    success: true,
    data: null,
    error: null,
    pagination: null,
  };

  try {
    const updatedCommercialEnablement =
      await dbSupabase.commercial_enablement.update(args);

    response.data = updatedCommercialEnablement.id;

    revalidatePath('/private/admin/commercial_enablement');
  } catch (error) {
    console.error(error);
    response.success = false;
    response.error = 'Error al editar el registro de habilitación comercial';
  }

  return response;
};

export const getCitySections = async (): Promise<city_section[]> => {
  try {
    const citySections = await dbSupabase.city_section.findMany();

    return citySections;
  } catch (error) {
    console.error(error);
    throw new Error('Error al obtener las secciones de la ciudad');
  }
};

export const getNeighborhoods = async (): Promise<neighborhood[]> => {
  try {
    const neighborhoods = await dbSupabase.neighborhood.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return neighborhoods;
  } catch (error) {
    console.error(error);

    throw new Error('Error al obtener los barrios');
  }
};

export const getCommercialActivities = async (): Promise<
  commercial_activity[]
> => {
  try {
    const commercial_activity = await dbSupabase.commercial_activity.findMany({
      orderBy: {
        activity: 'asc',
      },
    });

    return commercial_activity;
  } catch (error) {
    console.error(error);

    throw new Error('Error al obtener los rubros comerciales');
  }
};
