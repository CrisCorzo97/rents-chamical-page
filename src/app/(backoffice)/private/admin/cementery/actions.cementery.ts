'use server';
import dbSupabase from '@/lib/prisma/prisma';
import { cementery, Prisma } from '@prisma/client';

export const updateCementeryRecord = async (
  args: Prisma.cementeryUpdateArgs
): Promise<cementery['id']> => {
  const updatedCementeryRecord = await dbSupabase.cementery.update(args);

  return updatedCementeryRecord.id;
};
