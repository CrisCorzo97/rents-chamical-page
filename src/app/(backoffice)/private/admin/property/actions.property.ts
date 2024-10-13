'use server';
import dbSupabase from '@/lib/prisma/prisma';
import { Envelope } from '@/types/envelope';
import { city_section, neighborhood, Prisma, property } from '@prisma/client';
import { PropertyRecordWithRelations } from './property.interface';

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

/* --- ACCIONES DE LOS REGISTROS DE INMUEBLES --- */
export const getProperties = async (input: {
  limit?: number;
  page?: number;
  order_by?: Prisma.propertyOrderByWithRelationInput;
  filter?: Prisma.propertyWhereInput;
}): Promise<Envelope<PropertyRecordWithRelations[]>> => {
  const response: Envelope<PropertyRecordWithRelations[]> = {
    success: true,
    data: null,
    error: null,
    pagination: null,
  };
  try {
    const inputQuery: Prisma.propertyFindManyArgs = {
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

    const properties = await dbSupabase.property.findMany({
      ...inputQuery,
      include: {
        city_section: true,
        neighborhood: true,
      },
    });

    const propertiesCounted = await dbSupabase.property.count({
      where: inputQuery.where,
    });

    response.data = properties;
    response.pagination = {
      total_pages: Math.ceil(propertiesCounted / (inputQuery.take ?? 5)),
      total_items: propertiesCounted,
      page: input.page ? +input.page : 1,
      limit_per_page: inputQuery.take ?? 5,
    };

    return response;
  } catch (error) {
    console.error({ error });

    response.success = false;
    response.error = 'Hubo un error al obtener los registros de inmuebles.';

    return response;
  }
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
): Promise<property['id']> => {
  const updatedProperty = await dbSupabase.property.update(args);

  return updatedProperty.id;
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
    const neighborhoods = await dbSupabase.neighborhood.findMany();

    return neighborhoods;
  } catch (error) {
    console.error(error);

    throw new Error('Error al obtener los barrios');
  }
};
