'use server';

import { generateReceiptCode } from '@/lib/code-generator';
import dbSupabase from '@/lib/prisma/prisma';
import { Envelope } from '@/types/envelope';
import {
  affidavit,
  declarable_tax,
  Prisma,
  receipt,
  tax_penalties,
  user,
} from '@prisma/client';
import dayjs from 'dayjs';
import { revalidatePath } from 'next/cache';
import { DailyBoxContent } from './components/dailyBoxReport';

type AllReceipts =
  | (receipt & { type: 'receipt' })
  | (affidavit & {
      user: user;
      declarable_tax: declarable_tax;
      type: 'affidavit';
    })
  | (tax_penalties & {
      user: user;
      declarable_tax: declarable_tax;
      type: 'tax_penalty';
    });

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
      response.error = 'No se encontró el comprobante de pago';
      throw new Error('Receipt not found');
    }

    if (ReceiptFound.confirmed_at) {
      response.error =
        'El comprobante de pago ya fue confirmado con anterioridad';
      throw new Error('Receipt already confirmed');
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
    if (!response.error)
      response.error = 'Hubo un error al confirmar el comprobante de pago';
  } finally {
    revalidatePath('/admin/receipts');

    return response;
  }
};

const createNextReceiptCode = async () => {
  let new_code: string | null = null;

  try {
    const lastReceipts = await dbSupabase.receipt.findMany({
      orderBy: {
        created_at: 'desc',
      },
      take: 3,
      select: {
        id: true,
      },
    });

    const idOrder = lastReceipts.map((r) => r.id.split('-')[1]);

    const lastReceiptNumber = Math.max(...idOrder.map((id) => +id));

    const lastReceipt = lastReceipts.find((r) =>
      r.id.includes(lastReceiptNumber.toString())
    );

    if (!lastReceipt) {
      new_code = generateReceiptCode();
    } else new_code = generateReceiptCode(lastReceipt.id);
  } catch (error) {
    console.log({ error });
  } finally {
    return new_code;
  }
};

export const generateDailyBoxReport = async (date: string) => {
  const response: Envelope<DailyBoxContent> = {
    success: true,
    data: null,
    error: null,
    pagination: null,
  };

  try {
    const confirmedReceipts = await dbSupabase.receipt.findMany({
      where: {
        confirmed_at: {
          not: null,
          gte: dayjs(date).startOf('day').toISOString(),
          lte: dayjs(date).endOf('day').toISOString(),
        },
      },
      orderBy: {
        confirmed_at: 'asc',
      },
    });

    const affidavits = await dbSupabase.affidavit.findMany({
      where: {
        status: 'approved',
        approved_at: {
          not: null,
          gte: dayjs(date).startOf('day').toISOString(),
          lte: dayjs(date).endOf('day').toISOString(),
        },
      },
      orderBy: {
        approved_at: 'asc',
      },
      include: {
        declarable_tax: true,
        user: true,
      },
    });

    const taxPenalties = await dbSupabase.tax_penalties.findMany({
      where: {
        payment_date: {
          not: null,
          gte: dayjs(date).startOf('day').toISOString(),
          lte: dayjs(date).endOf('day').toISOString(),
        },
      },
      orderBy: {
        payment_date: 'asc',
      },
      include: {
        declarable_tax: true,
        user: true,
      },
    });

    if (
      !confirmedReceipts.length &&
      !affidavits.length &&
      !taxPenalties.length
    ) {
      response.data = {
        total_amount_collected: 0,
        total_receipts: 0,
        tax_summary: {
          add_new_page: false,
          details: {},
        },
        page_data: [],
      };

      return response;
    }

    const allReceipts: AllReceipts[] = [];
    let total_amount = 0;
    const details: Record<string, number> = {};

    for (const receipt of confirmedReceipts) {
      allReceipts.push({ ...receipt, type: 'receipt' });
      total_amount += receipt.amount;

      if (receipt.tax_type !== 'TASAS DIVERSAS') {
        if (details[receipt.tax_type]) {
          details[receipt.tax_type] += receipt.amount;
        } else {
          details[receipt.tax_type] = receipt.amount;
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

    for (const affidavit of affidavits) {
      allReceipts.push({ ...affidavit, type: 'affidavit' });
      total_amount += affidavit.fee_amount;

      const taxType = `DDJJ MENSUAL ${affidavit.declarable_tax.name.toUpperCase()}`;

      if (details[taxType]) {
        details[taxType] += affidavit.fee_amount;
      } else {
        details[taxType] = affidavit.fee_amount;
      }
    }

    for (const taxPenalty of taxPenalties) {
      allReceipts.push({ ...taxPenalty, type: 'tax_penalty' });
      total_amount += taxPenalty.amount;

      const taxType = `MULTA ${taxPenalty.declarable_tax.name.toUpperCase()}`;

      if (details[taxType]) {
        details[taxType] += taxPenalty.amount;
      } else {
        details[taxType] = taxPenalty.amount;
      }
    }

    const pageData: {
      page: number;
      subtotal: number;
      receipts: {
        id: string;
        paid_at: Date;
        taxpayer: string;
        tax_type: string;
        amount: number;
      }[];
      total_items: number;
    }[] = [];

    allReceipts.forEach((rec, index) => {
      if (index % 35 === 0) {
        if (rec.type === 'receipt') {
          pageData.push({
            page: pageData.length + 1,
            subtotal: rec.amount,
            receipts: [
              {
                id: rec.id,
                paid_at: rec.confirmed_at!,
                taxpayer: rec.taxpayer,
                tax_type: rec.tax_type,
                amount: rec.amount,
              },
            ],
            total_items: 1,
          });
        } else if (rec.type === 'affidavit') {
          pageData.push({
            page: pageData.length + 1,
            subtotal: rec.fee_amount,
            receipts: [
              {
                id: rec.invoice_id!,
                paid_at: rec.approved_at!,
                taxpayer: `${rec.user.first_name.toUpperCase()} ${rec.user.last_name.toUpperCase()}`,
                tax_type: `DDJJ MENSUAL ${rec.declarable_tax.name.toUpperCase()}`,
                amount: rec.fee_amount,
              },
            ],
            total_items: 1,
          });
        } else if (rec.type === 'tax_penalty') {
          pageData.push({
            page: pageData.length + 1,
            subtotal: rec.amount,
            receipts: [
              {
                id: rec.invoice_id!,
                paid_at: rec.payment_date!,
                taxpayer: `${rec.user.first_name.toUpperCase()} ${rec.user.last_name.toUpperCase()}`,
                tax_type: `MULTA ${rec.declarable_tax.name.toUpperCase()}`,
                amount: rec.amount,
              },
            ],
            total_items: 1,
          });
        }
      } else {
        const lastPage = pageData.find((p) => p.page === pageData.length);

        if (rec.type === 'receipt') {
          lastPage!.subtotal += rec.amount;
          lastPage!.receipts.push({
            id: rec.id,
            paid_at: rec.confirmed_at!,
            taxpayer: rec.taxpayer,
            tax_type: rec.tax_type,
            amount: rec.amount,
          });
          lastPage!.total_items += 1;
        } else if (rec.type === 'affidavit') {
          lastPage!.subtotal += rec.fee_amount;
          lastPage!.receipts.push({
            id: rec.invoice_id!,
            paid_at: rec.approved_at!,
            taxpayer: `${rec.user.first_name.toUpperCase()} ${rec.user.last_name.toUpperCase()}`,
            tax_type: `DDJJ MENSUAL ${rec.declarable_tax.name.toUpperCase()}`,
            amount: rec.fee_amount,
          });
          lastPage!.total_items += 1;
        } else if (rec.type === 'tax_penalty') {
          lastPage!.subtotal += rec.amount;
          lastPage!.receipts.push({
            id: rec.invoice_id!,
            paid_at: rec.payment_date!,
            taxpayer: `${rec.user.first_name.toUpperCase()} ${rec.user.last_name.toUpperCase()}`,
            tax_type: `MULTA ${rec.declarable_tax.name.toUpperCase()}`,
            amount: rec.amount,
          });
          lastPage!.total_items += 1;
        }
      }
    });

    try {
      await dbSupabase.daily_box_report.create({
        data: {
          date: dayjs().toDate(),
          total_amount,
          details,
          other_data: {
            confirmed_receipts: allReceipts.length,
          },
        },
      });
    } catch (error) {
      console.error({ error });
      throw new Error('Error creating daily box report');
    }

    const tax_summary = {
      add_new_page: false,
      details,
    };

    const availableSpace = 35 - (pageData.at(-1)?.total_items ?? 0);

    if (availableSpace < Object.keys(details).length + 2) {
      tax_summary.add_new_page = true;
    }

    response.data = {
      total_amount_collected: total_amount,
      total_receipts: confirmedReceipts.length,
      tax_summary,
      page_data: pageData,
    };
  } catch (error) {
    console.error(error);
    response.success = false;
    response.error = 'Hubo un error al generar el reporte de caja diaria';
  } finally {
    return response;
  }
};
