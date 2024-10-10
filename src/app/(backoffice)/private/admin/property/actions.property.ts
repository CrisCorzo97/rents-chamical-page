'use server';
import dbSupabase from '@/lib/prisma/prisma';
import { city_section, neighborhood, Prisma, property } from '@prisma/client';

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
