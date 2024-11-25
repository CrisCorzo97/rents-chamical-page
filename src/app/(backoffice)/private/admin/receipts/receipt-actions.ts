'use server';

import { generateReceiptCode } from '@/lib/code-generator';
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
      where: {
        confirmed_at: { not: null },
      },
      take: 5,
      orderBy: {
        confirmed_at: 'desc',
      },
    };

    if (input.filter) {
      inputQuery.where = {
        ...inputQuery.where,
        ...input.filter,
      };
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

    const confirmed_receipts = await dbSupabase.receipt.findMany(inputQuery);

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
    response.success = false;
    response.error =
      'Hubo un error al buscar los comprobantes de pago confirmados';
  }

  return response;
};

export const createReceipt = async (input: {
  data: Omit<Prisma.receiptCreateInput, 'id'>;
}) => {
  const response: Envelope<receipt> = {
    success: true,
    data: null,
    error: null,
    pagination: null,
  };

  try {
    const new_code = await createNextReceiptCode();

    if (!new_code) {
      response.success = false;
      response.error = 'Hubo un error al generar el código del comprobante';
      return response;
    }

    const receipt = await dbSupabase.receipt.create({
      data: {
        id: new_code,
        ...input.data,
      },
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
        id,
      },
    });

    if (!ReceiptFound) {
      throw new Error('Receipt not found');
    }

    if (['INMUEBLE', 'CEMENTERIO'].includes(tax_type)) {
      const confirmed = await getConfirmedReceipts({
        filter: {
          id_tax_reference,
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
        id,
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

const createNextReceiptCode = async () => {
  let new_code: string | null = null;

  try {
    const lastReceipt = await dbSupabase.receipt.findFirst({
      orderBy: {
        created_at: 'desc',
      },
      select: {
        id: true,
      },
    });

    if (!lastReceipt) {
      new_code = generateReceiptCode();
    } else new_code = generateReceiptCode(lastReceipt.id);
  } catch (error) {
    console.log({ error });
  } finally {
    return new_code;
  }
};

export const generateDailyBoxReport = async () => {
  const response: Envelope<receipt[]> = {
    success: true,
    data: null,
    error: null,
    pagination: null,
  };

  try {
    const confirmedReceipts = await dbSupabase.receipt.findMany({
      where: {
        confirmed_at: { not: null },
        created_at: {
          gte: dayjs().startOf('day').toISOString(),
          lte: dayjs().endOf('day').toISOString(),
        },
      },
    });

    if (!confirmedReceipts) {
      throw new Error('Error getting confirmed receipts');
    }

    let total_amount = 0;
    const details: Record<string, number> = {};

    for (const receipt of confirmedReceipts) {
      total_amount += receipt.amount;

      if (receipt.tax_type === 'CEMENTERIO') {
        if (details['CEMENTERIO']) {
          details['CEMENTERIO'] += receipt.amount;
        } else {
          details['CEMENTERIO'] = receipt.amount;
        }
      } else if (receipt.tax_type === 'INMUEBLE') {
        if (details['INMUEBLE']) {
          details['INMUEBLE'] += receipt.amount;
        } else {
          details['INMUEBLE'] = receipt.amount;
        }
      } else if (receipt.tax_type === 'PATENTE') {
        if (details['PATENTE']) {
          details['PATENTE'] += receipt.amount;
        } else {
          details['PATENTE'] = receipt.amount;
        }
      } else {
        const otherData = receipt.other_data as Prisma.JsonObject;
        const taxOrContribution = (
          otherData['tax_or_contribution'] as string
        ).toUpperCase();
        if (details[taxOrContribution]) {
          details[taxOrContribution] += receipt.amount;
        } else {
          details[taxOrContribution] = receipt.amount;
        }
      }
    }

    try {
      await dbSupabase.daily_box_report.create({
        data: {
          date: dayjs().toDate(),
          total_amount,
          details,
          other_data: {
            confirmed_receipts: confirmedReceipts.length,
          },
        },
      });
    } catch (error) {
      console.error({ error });
      throw new Error('Error creating daily box report');
    }

    response.data = confirmedReceipts;
  } catch (error) {
    console.error(error);
    response.success = false;
    response.error = 'Hubo un error al generar el reporte de caja diaria';
  } finally {
    return response;
  }
};
