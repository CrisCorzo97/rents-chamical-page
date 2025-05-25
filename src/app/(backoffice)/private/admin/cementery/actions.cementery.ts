'use server';
import dbSupabase from '@/lib/prisma/prisma';
import { Envelope, PaginationParams } from '@/types/envelope';
import {
  burial_type,
  cementery,
  cementery_place,
  neighborhood,
  Prisma,
} from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { CementeryRecordWithRelations } from './cementery.interface';

export const getCementeryRecordById = async (
  id: string
): Promise<CementeryRecordWithRelations | null> => {
  const cementeryRecord = await dbSupabase.cementery.findUnique({
    where: { id },
    include: {
      burial_type: true,
      neighborhood: true,
      cementery_place: true,
    },
  });

  return cementeryRecord;
};

export const getCementeryRecords = async ({
  limit,
  page,
  sort_by,
  sort_direction,
  filters,
}: PaginationParams): Promise<Envelope<CementeryRecordWithRelations[]>> => {
  const response: Envelope<CementeryRecordWithRelations[]> = {
    success: true,
    data: null,
    error: null,
    pagination: null,
  };
  try {
    const inputQuery: Prisma.cementeryFindManyArgs = {
      take: limit ?? 8,
      orderBy: {
        taxpayer: 'asc',
      },
    };

    if (page) {
      inputQuery.skip = (+page - 1) * (inputQuery.take ?? 8);
    }

    if (filters) {
      const { taxpayer, deceased_name } = filters;
      inputQuery.where = {
        ...inputQuery.where,
        ...(taxpayer && {
          taxpayer: { contains: taxpayer as string, mode: 'insensitive' },
        }),
        ...(deceased_name && {
          deceased_name: {
            contains: deceased_name as string,
            mode: 'insensitive',
          },
        }),
      };
    }

    if (sort_by) {
      inputQuery.orderBy = {
        [sort_by]: sort_direction,
      };
    }

    const cementeryRecords = await dbSupabase.cementery.findMany({
      ...inputQuery,
      include: {
        burial_type: true,
        neighborhood: true,
        cementery_place: true,
      },
    });

    const cementeryRecordsCounted = await dbSupabase.cementery.count({
      where: inputQuery.where,
    });

    response.data = cementeryRecords;
    response.pagination = {
      totalPages: Math.ceil(cementeryRecordsCounted / (inputQuery.take ?? 8)),
      totalItems: cementeryRecordsCounted,
      page: page ? +page : 1,
      limit: inputQuery.take ?? 8,
    };
  } catch (error) {
    console.error({ error });

    response.success = false;
    response.error = 'Hubo un error al obtener los registros de cementerio.';
  }

  return response;
};

export const createCementeryRecord = async (
  input: Prisma.cementeryCreateInput
): Promise<Envelope<cementery['id']>> => {
  const response: Envelope<cementery['id']> = {
    success: true,
    data: null,
    error: null,
    pagination: null,
  };

  try {
    const newCementery = await dbSupabase.cementery.create({ data: input });

    response.data = newCementery.id;

    revalidatePath('/private/admin/cementery');
  } catch (error) {
    console.error(error);
    response.success = false;
    response.error = 'Error al crear el registro de cementerio';
  } finally {
    return response;
  }
};

export const updateCementery = async (
  args: Prisma.cementeryUpdateArgs
): Promise<Envelope<cementery['id']>> => {
  const response: Envelope<cementery['id']> = {
    success: true,
    data: null,
    error: null,
    pagination: null,
  };

  try {
    const updatedCementery = await dbSupabase.cementery.update(args);

    response.data = updatedCementery.id;

    revalidatePath('/private/admin/cementery');
  } catch (error) {
    console.error(error);
    response.success = false;
    response.error = 'Error al editar el registro de cementerio';
  }

  return response;
};

export const getBurialTypes = async (): Promise<burial_type[]> => {
  try {
    const burialTypes = await dbSupabase.burial_type.findMany();

    return burialTypes;
  } catch (error) {
    console.error(error);
    throw new Error('Error al obtener los tipos de sepultura');
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

export const getCementeryPlaces = async (): Promise<cementery_place[]> => {
  try {
    const cementeryPlaces = await dbSupabase.cementery_place.findMany();

    return cementeryPlaces;
  } catch (error) {
    console.error(error);

    throw new Error('Error al obtener el listado de cementerios');
  }
};
