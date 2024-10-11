'use server';
import dbSupabase from '@/lib/prisma/prisma';
import { Envelope } from '@/types/envelope';
import { city_section, neighborhood, Prisma, property } from '@prisma/client';

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
