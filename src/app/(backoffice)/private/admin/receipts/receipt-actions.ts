'use server';

import dbSupabase from '@/lib/prisma/prisma';
import { Envelope } from '@/types/envelope';
import { Prisma, receipt } from '@prisma/client';
import dayjs from 'dayjs';

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
};

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

export const confirmReceipt = async (input: { data: receipt }) => {
  const response: Envelope<{ id: string; confirmed_at: string }> = {
    success: true,
    data: null,
    error: null,
    pagination: null,
  };

  const {
    data: { id, tax_type, id_tax_reference, other_data },
  } = input;

  try {
    const ReceiptFound = await dbSupabase.receipt.findUnique({
      where: {
        id: id,
      },
    });

    if (!ReceiptFound) {
      throw new Error('Receipt not found');
    }

    if (['INMUEBLE', 'CEMENTERIO'].includes(tax_type)) {
      const confirmed = await getConfirmedReceipts({
        filter: {
          id_tax_reference: id_tax_reference,
        },
      });

      let last_year_paid = (other_data as Prisma.JsonObject)
        .year_to_pay as number;

      if (!!confirmed && confirmed.data && confirmed.data.length > 0) {
        const years_paid = confirmed.data.map(
          (r) => (r.other_data as Prisma.JsonObject)!.year_to_pay as number
        );

        last_year_paid = Math.max(
          ...years_paid,
          (other_data as Prisma.JsonObject).year_to_pay as number
        );
      }

      if (tax_type === 'INMUEBLE') {
        try {
          await dbSupabase.property.update({
            where: {
              id: id_tax_reference,
            },
            data: {
              last_year_paid,
            },
          });
        } catch (error) {
          console.error({ error });
          throw new Error('Error updating property');
        }
      } else if (tax_type === 'CEMENTERIO') {
        try {
          await dbSupabase.cementery.update({
            where: {
              id: id_tax_reference,
            },
            data: {
              last_year_paid,
            },
          });
        } catch (error) {
          console.error({ error });
          throw new Error('Error updating cemetery');
        }
      }
    }

    const receipt = await dbSupabase.receipt.update({
      where: {
        id: id,
      },
      data: {
        confirmed_at: dayjs().toISOString(),
      },
    });

    response.data = {
      id: receipt.id,
      confirmed_at: dayjs(receipt.confirmed_at).format('DD/MM/YYYY HH:mm'),
    };
  } catch (error) {
    console.error({ error });
    response.success = false;
    response.error = 'Hubo un error al confirmar el comprobante de pago';
  } finally {
    return response;
  }
};
