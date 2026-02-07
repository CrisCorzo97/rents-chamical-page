'use server';
import { formatName } from '@/lib/formatters';
import { dbSupabase } from '@/lib/prisma/prisma';
import { getFirstBusinessDay } from '@/lib/providers';
import { Envelope, PaginationParams } from '@/types/envelope';
import {
  affidavit,
  affidavit_status,
  declarable_tax_period,
  Prisma,
} from '@prisma/client';
import dayjs from 'dayjs';
import locale from 'dayjs/locale/es';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import { revalidatePath } from 'next/cache';
import { getTaxpayerData } from '../../lib/get-taxpayer-data';
import {
  AffidavitWithRelations,
  CalculateInfo,
  PeriodToSubmit,
} from '../types/affidavits.types';

dayjs.extend(customParseFormat);
dayjs.locale(locale);
dayjs.extend(utc);

const FINANCIAL_ACTIVITIES_CODE = ['641930'];

const DAYS_TO_ADD_BY_TAX_ID = {
  0: [0, 1, 2],
  1: [3, 4, 5],
  2: [6, 7],
  3: [8, 9],
};

export const getDeclarableTaxPeriod = async (period: string) => {
  const response: Envelope<declarable_tax_period> = {
    success: true,
    data: null,
    error: null,
    pagination: null,
  };

  try {
    const declarableTaxPeriod =
      await dbSupabase.declarable_tax_period.findFirst({
        where: {
          declarable_tax_id: 'commercial_activity',
          period,
        },
      });

    response.data = declarableTaxPeriod;
  } catch (error) {
    response.success = false;
    if (error instanceof Error) {
      response.error = error.message;
    } else {
      response.error = 'Error al obtener la información del período a';
    }
  } finally {
    return response;
  }
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

    const { data: declarableTaxPeriod } = await getDeclarableTaxPeriod(period);

    if (!declarableTaxPeriod) {
      throw new Error('No se encontró el período de declaración');
    }

    const previousAffidavit = await dbSupabase.affidavit.findMany({
      where: {
        period,
        taxpayer_id: user.id,
        declarable_tax: {
          id: 'commercial_activity',
        },
      },
      orderBy: {
        version: 'desc',
      },
      take: 1,
    });

    let daysToAdd = 0;

    for (const [key, value] of Object.entries(DAYS_TO_ADD_BY_TAX_ID)) {
      const lastDigitTaxId = Number(user.user_metadata.tax_id.slice(-1));

      if (value.includes(lastDigitTaxId)) {
        daysToAdd = Number(key);
        break;
      }
    }

    let tentativePaymentDueDate = dayjs(declarableTaxPeriod.payment_due_date)
      .add(daysToAdd, 'day')
      .format('YYYY-MM-DD');

    const paymentDueDate = await getFirstBusinessDay(tentativePaymentDueDate);

    const affidavitData: Prisma.affidavitCreateInput = {
      tax_id: user.user_metadata.tax_id,
      declarable_tax: {
        connect: { id: 'commercial_activity' },
      },
      declared_amount,
      fee_amount,
      payment_due_date: dayjs(paymentDueDate).toDate(),
      period,
      status: 'pending_payment',
      user: {
        connect: { id: user.id },
      },
    };

    if (previousAffidavit.length > 0) {
      affidavitData.is_rectifying = true;
      affidavitData.version = previousAffidavit[0].version + 1;
      affidavitData.affidavit = {
        connect: {
          id: previousAffidavit[0].original_affidavit_id!,
        },
      };
    }

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

export const getPeriodsToSubmit = async (year: string) => {
  const response: Envelope<PeriodToSubmit[]> = {
    success: true,
    data: [],
    error: null,
    pagination: null,
  };

  try {
    const declarablePeriods = await dbSupabase.declarable_tax_period.findMany({
      where: {
        declarable_tax_id: 'commercial_activity',
        period: {
          contains: year,
        },
      },
    });

    const { data: affidavits } = await getAffidavits({
      filters: {
        period: year,
      },
      limit: 100,
      sort_by: 'period',
      sort_direction: 'asc',
    });

    const { commercial_enablements } = await getTaxpayerData();
    console.log({ commercial_enablements });

    if (commercial_enablements.length === 0) {
      return response;
    }

    const periods = declarablePeriods.map((period) => {
      const isEnabled =
        dayjs(period.period).isAfter(
          dayjs(commercial_enablements[0]?.registration_date)
            .startOf('month')
            .subtract(1, 'day')
        ) && dayjs().isAfter(dayjs(period.start_date));

      return {
        label: formatName(dayjs(period.period).format('MMMM YYYY')),
        value: period.period,
        enabled: isEnabled,
        nextToSubmit: false,
      };
    });

    let nextToSubmitAssigned = false;

    periods.forEach((period) => {
      const wasSubmitted = affidavits?.some(
        (affidavit) => affidavit.period === period.value
      );

      if (!wasSubmitted && period.enabled) {
        if (!nextToSubmitAssigned) {
          period.nextToSubmit = true;
          nextToSubmitAssigned = true;
        } else {
          period.enabled = false;
        }
      }
    });

    response.data = periods;
  } catch (error) {
    console.error(error);
    response.success = false;
    if (error instanceof Error) {
      response.error = error.message;
    } else {
      response.error = 'Hubo un error al obtener los períodos a presentar';
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
