'use server';

import dbSupabase from '@/lib/prisma/prisma';
import { Envelope } from '@/types/envelope';
import { Prisma, receipt } from '@prisma/client';

export const getReceiptById = async (input: { id: string }) => {
  const response: Envelope<receipt> = {
    success: true,
    data: null,
    error: null,
    pagination: null,
  };

  try {
    const receipt = await dbSupabase.receipt.findUnique({
      where: {
        id: input.id,
      },
    });

    response.data = receipt;
  } catch (error) {
    console.error({ error });

    response.success = false;
    response.error = 'Hubo un error al buscar el comprobante de pago';
  }

  return response;
}

export const getConfirmedReceipts = async (input: {
  limit?: number;
  page?: number;
  order_by?: Prisma.receiptOrderByWithRelationInput;
  filter?: Prisma.receiptWhereInput;
}) => {
  const response: Envelope<receipt[]> = {
    success: true,
    data: null,
    error: null,
    pagination: null,
  };

  try {
    const inputQuery: Prisma.receiptFindManyArgs = {
      take: 5,
      orderBy: {
        confirmed_at: 'desc',
      },
    };

    if (input.filter) {
      inputQuery.where = input.filter;
    }
    if (input.page) {
      inputQuery.skip = +input.page - 1;
    }
    if (input.limit) {
      inputQuery.take = +input.limit;
    }
    if (input.order_by) {
      inputQuery.orderBy = input.order_by;
    }

    const confirmed_receipts = await dbSupabase.receipt.findMany({
      where: {
        confirmed_at: { not: null },
      },
      orderBy: input.order_by,
    });

    const count = await dbSupabase.receipt.count({
      where: {
        confirmed_at: { not: null },
      },
    });

    response.data = confirmed_receipts;
    response.pagination = {
      total_pages: Math.ceil(count / (inputQuery.take ?? 5)),
      total_items: count,
      page: input.page ? +input.page : 1,
      limit_per_page: inputQuery.take ?? 5,
    };
  } catch (error) {
    console.error({ error });

    response.success = false;
    response.error =
      'Hubo un error al buscar los comprobantes de pago confirmados';
  }

  return response;
};

export const createReceipt = async (input: {
  data: Prisma.receiptCreateInput;
}) => {
  const response: Envelope<receipt> = {
    success: true,
    data: null,
    error: null,
    pagination: null,
  };

  try {
    const receipt = await dbSupabase.receipt.create({
      data: input.data,
    });

    response.data = receipt;
  } catch (error) {
    console.error({ error });

    response.success = false;
    response.error = 'Hubo un error al crear el comprobante de pago';
  }

  return response;
};
