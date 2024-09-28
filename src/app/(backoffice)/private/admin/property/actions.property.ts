'use server';
import dbSupabase from '@/lib/prisma/prisma';
import { Prisma, property } from '@prisma/client';

export const updateProperty = async (
  args: Prisma.propertyUpdateArgs
): Promise<property['id']> => {
  const updatedProperty = await dbSupabase.property.update(args);

  return updatedProperty.id;
};
