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

export const getComercialEnablements = async (input: {
  limit?: number;
  page?: number;
  order_by?: Prisma.commercial_enablementOrderByWithRelationInput;
  filter?: Prisma.commercial_enablementWhereInput;
}): Promise<Envelope<CommercialEnablementWithRelations[]>> => {
  const response: Envelope<CommercialEnablementWithRelations[]> = {
    success: true,
    data: null,
    error: null,
    pagination: null,
  };
  try {
    const inputQuery: Prisma.commercial_enablementFindManyArgs = {
      take: 5,
      orderBy: {
        taxpayer: 'asc',
      },
    };

    if (input.filter) {
      inputQuery.where = input.filter;
    }
    if (input.page) {
      inputQuery.skip = (+input.page - 1) * (input?.limit ?? 5);
    }
    if (input.limit) {
      inputQuery.take = +input.limit;
    }
    if (input.order_by) {
      inputQuery.orderBy = input.order_by;
    }

    const commercialEnablements =
      await dbSupabase.commercial_enablement.findMany({
        ...inputQuery,
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

    const commercialEnablementsCounted =
      await dbSupabase.commercial_enablement.count({
        where: inputQuery.where,
      });

    response.data = commercialEnablements;
    response.pagination = {
      total_pages: Math.ceil(
        commercialEnablementsCounted / (inputQuery.take ?? 5)
      ),
      total_items: commercialEnablementsCounted,
      page: input.page ? +input.page : 1,
      limit_per_page: inputQuery.take ?? 5,
    };
  } catch (error) {
    console.error({ error });

    response.success = false;
    response.error =
      'Hubo un error al obtener los registros de habilitaciones comerciales.';
  }

  return response;
};

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
    const commercial_activity = await dbSupabase.commercial_activity.findMany();

    return commercial_activity;
  } catch (error) {
    console.error(error);

    throw new Error('Error al obtener los rubros comerciales');
  }
};
