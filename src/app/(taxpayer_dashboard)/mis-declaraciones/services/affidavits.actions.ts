import { Envelope, PaginationParams } from '@/types/envelope';
import { getTaxpayerData } from '../../lib/get-taxpayer-data';
import { dbSupabase } from '@/lib/prisma/prisma';
import {
  affidavit,
  affidavit_status,
  declaration_period,
  Prisma,
} from '@prisma/client';
import {
  AffidavitWithRelations,
  CalculateInfo,
} from '../types/affidavits.types';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from 'dayjs';
import { getFirstBusinessDay } from '@/lib/providers';
import { revalidatePath } from 'next/cache';

dayjs.extend(customParseFormat);

const FINANCIAL_ACTIVITIES_CODE = ['641930'];

export const PERIOD_MAP: Record<declaration_period, number> = {
  month: 1,
  bimester: 2,
  quarter: 3,
  four_month: 4,
  semester: 6,
  year: 12,
};

const DAYS_TO_ADD_BY_TAX_ID = {
  0: [0, 1, 2],
  1: [3, 4, 5],
  2: [6, 7],
  3: [8, 9],
};

export const getAffidavits = async ({
  page = 1,
  limit = 8,
  sort_by = 'created_at',
  sort_direction = 'desc',
  filters,
}: PaginationParams) => {
  const response: Envelope<AffidavitWithRelations[]> = {
    success: true,
    data: null,
    error: null,
    pagination: null,
  };

  try {
    const taxpayerData = await getTaxpayerData();

    const queries: Prisma.affidavitFindManyArgs = {
      where: {
        taxpayer_id: taxpayerData.user.id,
        period: {
          contains: dayjs().format('YYYY'),
        },
      },
      orderBy: {
        created_at: 'desc',
      },
      take: limit,
    };

    if (page) {
      queries.skip = (page - 1) * limit;
    }

    if (sort_by && sort_direction) {
      queries.orderBy = {
        [sort_by]: sort_direction,
      };
    }

    if (filters) {
      const { status, period } = filters;
      queries.where = {
        ...queries.where,
        status: status as affidavit_status,
        period: {
          contains: period as string,
        },
      };
    }

    const [affidavits, total_items] = await Promise.all([
      dbSupabase.affidavit.findMany({
        ...queries,
        include: {
          declarable_tax: true,
          invoice: true,
        },
      }),
      dbSupabase.affidavit.count({
        where: {
          ...queries.where,
        },
      }),
    ]);

    response.data = affidavits;
    response.pagination = {
      page,
      limit,
      totalItems: total_items,
      totalPages: Math.ceil(total_items / limit),
    };
  } catch (error) {
    response.success = false;
    if (error instanceof Error) {
      response.error = error.message;
    } else {
      response.error = 'Error al obtener las declaraciones';
    }
  }

  return response;
};

export const getAffidavit = async ({ period }: { period: string }) => {
  const response: Envelope<affidavit> = {
    success: true,
    data: null,
    error: null,
    pagination: null,
  };

  try {
    const taxpayerData = await getTaxpayerData();

    const affidavit = await dbSupabase.affidavit.findFirst({
      where: {
        period,
        taxpayer_id: taxpayerData.user.id,
        declarable_tax: {
          id: 'commercial_activity',
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    response.data = affidavit;
  } catch (error) {
    response.success = false;
    if (error instanceof Error) {
      response.error = error.message;
    } else {
      response.error = 'Error al obtener la declaración';
    }
  }

  return response;
};

export const calculateFeeAmount = async (input: {
  amount: number;
  category?: string;
}) => {
  const { amount, category } = input;

  let feeAmount = 0;
  let feeAliquot = 0;

  try {
    const { commercial_enablements } = await getTaxpayerData();
    const declarableTax = await getDeclarableTax();

    const { cases, minimun_tax_amount } =
      declarableTax.calculate_info as CalculateInfo;

    // Si se especifica una categoría, usar esa
    if (category) {
      const feeCase = cases.find((c) => c.category === category);
      if (!feeCase) {
        throw new Error(`No se encontró el caso para la categoría ${category}`);
      }

      if (category === 'Bancos-Entidades Financieras-Compañías Financieras') {
        if (feeCase.subcases[0].type === 'fixed') {
          feeAmount = feeCase.subcases[0].fixed_rate;
        } else {
          feeAliquot = feeCase.subcases[0].fee;
        }
      } else {
        for (const subcase of feeCase.subcases) {
          if (
            amount > subcase.amount_from &&
            (amount <= subcase.amount_up_to || subcase.amount_up_to < 0)
          ) {
            if (subcase.type === 'fixed') {
              feeAmount = subcase.fixed_rate;
              break;
            } else {
              feeAliquot = subcase.fee;
              break;
            }
          }
        }
      }
    } else {
      // Comportamiento anterior - detectar por tipo de actividad
      if (
        FINANCIAL_ACTIVITIES_CODE.includes(
          commercial_enablements[0]!.commercial_activity?.code ?? ''
        )
      ) {
        const feeCase = cases.find(
          (c) =>
            c.category === 'Bancos-Entidades Financieras-Compañías Financieras'
        );
        if (!feeCase) {
          throw new Error(
            'No se encontró el caso para la actividad financiera'
          );
        }

        if (feeCase.subcases[0].type === 'fixed') {
          feeAmount = feeCase.subcases[0].fixed_rate;
        } else {
          feeAliquot = feeCase.subcases[0].fee;
        }
      } else {
        const feeCase = cases.find(
          (c) => c.category === 'Comercios-Servicios-Industrias'
        );
        if (!feeCase) {
          throw new Error(
            'No se encontró el caso para la actividad de comercio, servicios o industrias'
          );
        }

        for (const subcase of feeCase.subcases) {
          if (
            amount > subcase.amount_from &&
            (amount <= subcase.amount_up_to || subcase.amount_up_to < 0)
          ) {
            if (subcase.type === 'fixed') {
              feeAmount = subcase.fixed_rate;
              break;
            } else {
              feeAliquot = subcase.fee;
              break;
            }
          }
        }
      }
    }

    if (feeAliquot !== 0) {
      feeAmount = amount * feeAliquot;
    }

    if (feeAmount < minimun_tax_amount) {
      feeAmount = minimun_tax_amount;
    }

    return feeAmount;
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error('Hubo un error al calcular el monto de la tasa');
  }
};

export const createAffidavit = async (input: {
  declared_amount: number;
  fee_amount: number;
  period: string;
}) => {
  const { declared_amount, fee_amount, period } = input;

  const response: Envelope<affidavit> = {
    success: true,
    data: null,
    error: null,
    pagination: null,
  };

  try {
    const { user } = await getTaxpayerData();

    const declarableTax = await getDeclarableTax();

    const paymentPeriodicity = PERIOD_MAP[declarableTax.payment_periodicity];

    const monthsToAdd =
      paymentPeriodicity -
      (dayjs(period, 'MMMM-YYYY').month() % paymentPeriodicity === 0 ? 0 : 1);

    let daysToAdd = 0;

    for (const [key, value] of Object.entries(DAYS_TO_ADD_BY_TAX_ID)) {
      const lastDigitTaxId = Number(user.user_metadata.tax_id.slice(-1));

      if (value.includes(lastDigitTaxId)) {
        daysToAdd = Number(key);
        break;
      }
    }

    let tentativePaymentDueDate = dayjs(period, 'MMMM-YYYY')
      .add(monthsToAdd, 'month')
      .date(Number(declarableTax.procedure_expiration_day))
      .add(daysToAdd, 'day')
      .format('YYYY-MM-DD');

    if (tentativePaymentDueDate.split('-')[1] === '03') {
      tentativePaymentDueDate = dayjs(tentativePaymentDueDate)
        .add(13, 'day')
        .format('YYYY-MM-DD');
    }

    if (tentativePaymentDueDate.split('-')[1] === '05') {
      tentativePaymentDueDate = dayjs(tentativePaymentDueDate)
        .add(10, 'day')
        .format('YYYY-MM-DD');
    }

    const paymentDueDate = await getFirstBusinessDay(tentativePaymentDueDate);

    const affidavitData: Prisma.affidavitCreateInput = {
      tax_id: user.user_metadata.tax_id,
      declarable_tax: {
        connect: { id: 'commercial_activity' },
      },
      declared_amount,
      fee_amount,
      payment_due_date: dayjs(paymentDueDate)
        .endOf('day')
        .subtract(3, 'hour')
        .toDate(),
      period: dayjs(period, 'MMMM-YYYY').format('YYYY-MM-DD'),
      status: 'pending_payment',
      user: {
        connect: { id: user.id },
      },
    };

    response.data = await dbSupabase.affidavit.create({
      data: affidavitData,
    });

    revalidatePath('/mis-declaraciones');
  } catch (error) {
    console.error(error);
    response.success = false;

    if (error instanceof Error) {
      response.error = error.message;
    } else {
      response.error = 'Hubo un error al crear la declaración';
    }
  } finally {
    return response;
  }
};

const getDeclarableTax = async () => {
  try {
    const declarableTax = await dbSupabase.declarable_tax.findFirst({
      where: {
        id: 'commercial_activity',
      },
    });

    if (!declarableTax) {
      throw new Error('No se encontró el impuesto declarable');
    }

    return declarableTax;
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Hubo un error al obtener el impuesto declarable');
  }
};
