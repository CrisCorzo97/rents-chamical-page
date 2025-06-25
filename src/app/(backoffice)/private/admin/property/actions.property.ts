'use server';
import dbSupabase from '@/lib/prisma/prisma';
import { Envelope, PaginationParams } from '@/types/envelope';
import { city_section, neighborhood, Prisma, property } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { PropertyRecordWithRelations } from './property.interface';

export async function getProperties({
  page = 1,
  limit = 8,
  sort_by,
  sort_direction,
  filters,
}: PaginationParams): Promise<Envelope<PropertyRecordWithRelations[]>> {
  const response: Envelope<PropertyRecordWithRelations[]> = {
    success: true,
    data: [],
    error: null,
    pagination: null,
  };

  try {
    const queries: Prisma.propertyFindManyArgs = {
      orderBy: {
        taxpayer: 'asc',
      },
      take: limit ?? 8,
    };

    if (page) {
      queries.skip = (+page - 1) * (queries.take ?? 8);
    }

    if (filters) {
      const { taxpayer, enrollment, search } = filters;
      queries.where = {
        ...queries.where,
        ...(taxpayer && {
          taxpayer: {
            contains: taxpayer as string,
            mode: 'insensitive',
          },
        }),
        ...(enrollment && {
          enrollment: {
            contains: enrollment as string,
            mode: 'insensitive',
          },
        }),
        ...(search && {
          OR: [
            { taxpayer: { contains: search as string, mode: 'insensitive' } },
            { enrollment: { contains: search as string, mode: 'insensitive' } },
          ],
        }),
      };
    }

    if (sort_by) {
      queries.orderBy = {
        [sort_by]: sort_direction ?? 'desc',
      };
    }

    const [total, items] = await Promise.all([
      dbSupabase.property.count({ where: queries.where }),
      dbSupabase.property.findMany({
        ...queries,
        include: {
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
    response.error = 'Hubo un error al obtener los registros de propiedades.';
  } finally {
    return response;
  }
}

export const getPropertyRecordById = async (
  id: string
): Promise<PropertyRecordWithRelations | null> => {
  const propertyRecord = await dbSupabase.property.findUnique({
    where: { id },
    include: {
      city_section: true,
      neighborhood: true,
    },
  });

  return propertyRecord;
};

export const createProperty = async (
  input: Prisma.propertyCreateInput
): Promise<Envelope<property['id']>> => {
  const response: Envelope<property['id']> = {
    success: true,
    data: null,
    error: null,
    pagination: null,
  };

  try {
    const newProperty = await dbSupabase.property.create({ data: input });

    response.data = newProperty.id;

    revalidatePath('/private/admin/property');
  } catch (error) {
    console.error(error);
    response.success = false;
    response.error = 'Error al crear el registro de propiedad';
  } finally {
    return response;
  }
};

export const updateProperty = async (
  args: Prisma.propertyUpdateArgs
): Promise<Envelope<property['id']>> => {
  const response: Envelope<property['id']> = {
    success: true,
    data: null,
    error: null,
    pagination: null,
  };

  try {
    const updatedProperty = await dbSupabase.property.update(args);

    response.data = updatedProperty.id;

    revalidatePath('/private/admin/property');
  } catch (error) {
    console.error(error);
    response.success = false;
    response.error = 'Error al editar el registro de propiedad';
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
