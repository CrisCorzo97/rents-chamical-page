'use server';

import dbSupabase from '@/lib/prisma/prisma';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Envelope } from '@/types/envelope';
import {
  $Enums,
  affidavit,
  commercial_activity,
  commercial_enablement,
  invoice,
  Prisma,
  tax_penalties,
} from '@prisma/client';
import { getPendingDeclarations, PERIOD_MAP, PeriodData } from '../lib';
import { getFirstBusinessDay } from '@/lib/providers';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import locale from 'dayjs/locale/es';
import {
  AffidavitWithRelations,
  CalculateInfo,
  ConceptToPay,
  InvoiceWithRelations,
} from './types';
import { AffidavitStatus } from './page';
import { generateInvoiceCode } from '@/lib/code-generator';
import { revalidatePath } from 'next/cache';
import { formatName } from '@/lib/formatters';
dayjs.extend(customParseFormat);
dayjs.locale(locale);

const FINANCIAL_ACTIVITIES_CODE = ['641930'];

const DAYS_TO_ADD_BY_TAX_ID = {
  0: [0, 1, 2],
  1: [3, 4, 5],
  2: [6, 7],
  3: [8, 9],
};

export const getAffidavits = async (input: {
  page?: string;
  items_per_page?: string;
  status?: AffidavitStatus;
  order_by?: Prisma.affidavitOrderByWithRelationInput;
  filter?: Prisma.affidavitWhereInput;
}) => {
  const response: Envelope<AffidavitWithRelations[]> = {
    success: true,
    data: null,
    error: null,
    pagination: null,
  };

  try {
    const { user } = await getUserAndCommercialEnablement();

    const queries: Prisma.affidavitFindManyArgs = {
      where: {
        AND: [
          { user: { id: user.id } },
          { declarable_tax_id: 'commercial_activity' },
        ],
      },
      orderBy: {
        created_at: 'desc',
      },
      take: 5,
    };

    if (input.page) {
      queries.skip = (+input.page - 1) * (queries.take ?? 5);
    }

    if (input.items_per_page) {
      queries.take = +input.items_per_page;
    }

    if (input.status) {
      let status:
        | $Enums.affidavit_status
        | Prisma.Enumaffidavit_statusFilter<'affidavit'>
        | undefined = undefined;

      switch (input.status) {
        case 'pending_payment':
          status = {
            in: ['pending_payment', 'refused'],
          };
          break;
        case 'under_review':
          status = 'under_review';
          break;
        case 'finished':
          status = 'approved';
          break;
      }

      queries.where = {
        ...queries.where,
        status,
      };
    }

    if (input.order_by) {
      queries.orderBy = input.order_by;
    }

    if (input.filter) {
      queries.where = {
        ...queries.where,
        ...input.filter,
      };
    }

    const [declarations, totalItems] = await Promise.all([
      dbSupabase.affidavit.findMany({
        ...queries,
        include: {
          invoice: true,
          user: true,
        },
      }),
      dbSupabase.affidavit.count({
        where: queries.where,
      }),
    ]);

    response.data = declarations;
    response.pagination = {
      totalPages: Math.ceil(totalItems / (queries.take ?? 5)),
      totalItems,
      page: input.page ? +input.page : 1,
      limit: queries.take ?? 5,
    };
  } catch (error) {
    console.error(error);
    response.success = false;

    if (error instanceof Error) {
      response.error = error.message;
    } else {
      response.error = 'Hubo un error al obtener las declaraciones';
    }
  } finally {
    return response;
  }
};

export const getTaxPenalties = async (input: {
  page?: string;
  items_per_page?: string;
  order_by?: Prisma.tax_penaltiesOrderByWithRelationInput;
  filter?: Prisma.tax_penaltiesWhereInput;
}) => {
  const response: Envelope<tax_penalties[]> = {
    success: true,
    data: null,
    error: null,
    pagination: null,
  };

  try {
    const { user } = await getUserAndCommercialEnablement();

    const queries: Prisma.tax_penaltiesFindManyArgs = {
      where: {
        user: { id: user.id },
        declarable_tax_id: 'commercial_activity',
      },
      orderBy: {
        created_at: 'desc',
      },
      take: 5,
    };

    if (input.items_per_page) {
      queries.take = +input.items_per_page;
    }

    if (input.page) {
      queries.skip = (+input.page - 1) * (queries.take ?? 5);
    }

    if (input.order_by) {
      queries.orderBy = input.order_by;
    }

    if (input.filter) {
      queries.where = {
        ...queries.where,
        ...input.filter,
      };
    }

    const [penalties, totalItems] = await Promise.all([
      dbSupabase.tax_penalties.findMany({
        ...queries,
      }),
      dbSupabase.tax_penalties.count({
        where: queries.where,
      }),
    ]);

    response.data = penalties;
    response.pagination = {
      totalPages: Math.ceil(totalItems / (queries.take ?? 5)),
      totalItems,
      page: input.page ? +input.page : 1,
      limit: queries.take ?? 5,
    };
  } catch (error) {
    console.error(error);
    response.success = false;

    if (error instanceof Error) {
      response.error = error.message;
    } else {
      response.error = 'Hubo un error al obtener las multas';
    }
  } finally {
    return response;
  }
};

export const getConceptsToPay = async () => {
  const response: Envelope<ConceptToPay[]> = {
    success: true,
    data: null,
    error: null,
    pagination: null,
  };

  try {
    const lte_payment_due_date = dayjs().add(2, 'month').toDate();

    const { data: affidavits } = await getAffidavits({
      items_per_page: '100',
      filter: {
        status: {
          in: ['pending_payment', 'refused'],
        },
        payment_due_date: {
          lte: lte_payment_due_date,
        },
      },
    });

    if (!Array.isArray(affidavits)) {
      throw new Error(
        'No se encontraron declaraciones juradas pendientes de pago'
      );
    }

    const { data: taxPenalties } = await getTaxPenalties({
      items_per_page: '100',
    });

    if (!Array.isArray(taxPenalties)) {
      throw new Error('No se encontraron multas pendientes de pago');
    }

    const concepts: ConceptToPay[] = [];

    for (const affidavit of affidavits) {
      concepts.push({
        id: affidavit.id,
        concept: 'DDJJ Actividad Comercial',
        period: formatName(dayjs(affidavit.period).format('MMMM YYYY')),
        amount: affidavit.fee_amount,
        dueDate: dayjs(affidavit.payment_due_date).format('DD/MM/YYYY'),
      });
    }

    for (const penalty of taxPenalties) {
      concepts.push({
        id: penalty.id,
        concept: 'Multa',
        period: formatName(dayjs(penalty.period).format('MMMM YYYY')),
        amount: penalty.amount,
        dueDate: dayjs(penalty.created_at).format('DD/MM/YYYY'),
      });
    }

    concepts.sort((a, b) => {
      if (
        dayjs(a.dueDate, 'DD/MM/YYYY').isBefore(dayjs(b.dueDate, 'DD/MM/YYYY'))
      )
        return -1;
      if (
        dayjs(a.dueDate, 'DD/MM/YYYY').isAfter(dayjs(b.dueDate, 'DD/MM/YYYY'))
      )
        return 1;
      return 0;
    });

    response.data = concepts;
  } catch (error) {
    console.error(error);
    response.success = false;

    if (error instanceof Error) {
      response.error = error.message;
    } else {
      response.error = 'Hubo un error al obtener los conceptos a pagar';
    }
  } finally {
    return response;
  }
};

export const getUpcomingDueDates = async () => {
  const response: Envelope<PeriodData[]> = {
    success: true,
    data: null,
    error: null,
    pagination: null,
  };

  try {
    const { user, commercial_enablement } =
      await getUserAndCommercialEnablement();

    response.data = await getPendingDeclarations({
      declarableTaxId: 'commercial_activity',
      userId: user.id,
      commercialEnablementRegistrationDate:
        commercial_enablement?.registration_date!.toISOString(),
    });
  } catch (error) {
    console.error(error);
    response.success = false;

    if (error instanceof Error) {
      response.error = error.message;
    } else {
      response.error = 'Hubo un error al calcular las fechas de vencimiento';
    }
  } finally {
    return response;
  }
};

export const getBalance = async () => {
  const response: Envelope<number> = {
    success: true,
    data: null,
    error: null,
    pagination: null,
  };

  try {
    const { user } = await getUserAndCommercialEnablement();

    const lte_payment_due_date = dayjs().add(2, 'month').toDate();

    const affidavits = await dbSupabase.affidavit.findMany({
      where: {
        user: { id: user.id },
        declarable_tax_id: 'commercial_activity',
        status: {
          in: ['pending_payment', 'refused'],
        },
        payment_due_date: {
          lte: lte_payment_due_date,
        },
      },
    });

    const taxPenalties = await dbSupabase.tax_penalties.findMany({
      where: {
        user: { id: user.id },
        declarable_tax_id: 'commercial_activity',
        payment_date: null,
      },
    });

    const total_amount =
      affidavits.reduce((acc, affidavit) => {
        return acc + affidavit.fee_amount;
      }, 0) +
      taxPenalties.reduce((acc, penalty) => {
        return acc + penalty.amount;
      }, 0);

    response.data = total_amount;
  } catch (error) {
    console.error(error);
    response.success = false;

    if (error instanceof Error) {
      response.error = error.message;
    } else {
      response.error = 'Hubo un error al obtener el saldo pendiente';
    }
  } finally {
    return response;
  }
};

export const calculateFeeAmount = async (input: {
  amount: number;
  category?: string;
}) => {
  const { amount, category } = input;

  let feeAmount = 0;
  let feeAliquot = 0;

  try {
    const { commercial_enablement } = await getUserAndCommercialEnablement();
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
          commercial_enablement!.commercial_activity?.code ?? ''
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
    const { user } = await getUserAndCommercialEnablement();

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

    revalidatePath('/tramites/DDJJ-actividad-comercial');
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

export const updateAffidavit = async (input: {
  affidavit_id: string;
  status?: affidavit['status'];
  invoice_id?: string;
}) => {
  const { affidavit_id, status, invoice_id } = input;

  const response: Envelope<affidavit> = {
    success: true,
    data: null,
    error: null,
    pagination: null,
  };

  try {
    const { user } = await getUserAndCommercialEnablement();

    const affidavitData = await dbSupabase.affidavit.findFirst({
      where: {
        id: affidavit_id,
        user: { id: user.id },
      },
    });

    if (!affidavitData) {
      throw new Error('No se encontró la declaración');
    }

    const updateData: Prisma.affidavitUpdateInput = {};

    if (status) {
      if (status === 'approved') {
        if (affidavitData.status === 'refused')
          throw new Error('No se puede aprobar una declaración rechazada');
        updateData.status = status;
        updateData.approved_at = dayjs().toDate();
      } else {
        updateData.status = status;
      }
    }

    if (invoice_id) {
      updateData.invoice = {
        connect: { id: invoice_id },
      };
    }

    const updated = await dbSupabase.affidavit.update({
      where: { id: affidavit_id },
      data: updateData,
    });

    response.data = updated;
  } catch (error) {
    console.error(error);
    response.success = false;

    if (error instanceof Error) {
      response.error = error.message;
    } else {
      response.error = 'Hubo un error al actualizar la declaración';
    }
  } finally {
    return response;
  }
};

export const createInvoice = async (input: {
  affidavit_ids: string[];
  tax_penalty_ids: string[];
}) => {
  const { affidavit_ids, tax_penalty_ids } = input;

  const response: Envelope<invoice> = {
    success: true,
    data: null,
    error: null,
    pagination: null,
  };

  try {
    const { user } = await getUserAndCommercialEnablement();
    const declarableTax = await getDeclarableTax();

    const compensatoryInterest =
      (declarableTax.calculate_info as CalculateInfo)?.compensatory_interest ??
      0;

    // Busco las declaraciones en base a los ids
    const affidavits = await dbSupabase.affidavit.findMany({
      where: {
        id: {
          in: affidavit_ids,
        },
        user: { id: user.id },
      },
      orderBy: {
        payment_due_date: 'desc',
      },
    });

    // Busco las multas en base a los ids
    const taxPenalties = await dbSupabase.tax_penalties.findMany({
      where: {
        id: {
          in: tax_penalty_ids,
        },
        user: { id: user.id },
      },
    });

    // Calculo el monto total de las multas
    const penaltiesAmount = taxPenalties.reduce(
      (acc, penalty) => acc + penalty.amount,
      0
    );

    // Calculo el monto total de las declaraciones y lo sumo con las multas
    const feeAmount =
      penaltiesAmount +
      affidavits.reduce((acc, affidavit) => acc + affidavit.fee_amount, 0);

    // Calculo los intereses compensatorios
    const interests = affidavits.reduce((acc, affidavit) => {
      const days = dayjs().diff(dayjs(affidavit.payment_due_date), 'day');
      if (days <= 0) return acc;
      return acc + affidavit.fee_amount * compensatoryInterest * days;
    }, 0);

    // Calculo el monto total de la factura
    const totalAmount = feeAmount + interests;

    const invoiceId = await getLastInvoiceCode();

    if (!invoiceId) {
      throw new Error('No se pudo obtener el código de la factura');
    }

    const due_date = dayjs().isAfter(
      dayjs(affidavits[0].payment_due_date),
      'day'
    )
      ? dayjs().endOf('day').subtract(3, 'hour').toISOString()
      : affidavits[0].payment_due_date;

    const invoiceData: Prisma.invoiceCreateInput = {
      id: invoiceId,
      fee_amount: feeAmount,
      compensatory_interest: interests,
      total_amount: totalAmount,
      due_date,
      status: 'pending_payment',
      user: {
        connect: { id: user.id },
      },
      affidavit: {
        connect: affidavits.map((a) => ({
          id: a.id,
        })),
      },
      tax_penalties: {
        connect: taxPenalties.map((tp) => ({
          id: tp.id,
        })),
      },
    };

    response.data = await dbSupabase.invoice.create({
      data: invoiceData,
    });
  } catch (error) {
    console.error(error);
    response.success = false;

    if (error instanceof Error) {
      response.error = error.message;
    } else {
      response.error = 'Hubo un error al crear la factura';
    }
  } finally {
    return response;
  }
};

export const updateInvoice = async (input: {
  invoice_id: string;
  attachment_file?: File;
}) => {
  const { invoice_id, attachment_file } = input;

  const response: Envelope<invoice> = {
    success: true,
    data: null,
    error: null,
    pagination: null,
  };

  try {
    const { user } = await getUserAndCommercialEnablement();

    const invoiceData = await dbSupabase.invoice.findFirst({
      where: {
        id: invoice_id,
        user: { id: user.id },
      },
      include: {
        affidavit: true,
        tax_penalties: true,
      },
    });

    if (!invoiceData) {
      throw new Error('No se encontró la factura');
    }

    let attachmentUrl = undefined;
    let paymentDate = undefined;

    if (attachment_file) {
      attachmentUrl = await uploadPaymentProof({
        invoice_id,
        file: attachment_file,
      });
      paymentDate = dayjs().toDate();
    }

    const updated = await dbSupabase.invoice.update({
      where: { id: invoice_id },
      data: {
        attached_receipt: attachmentUrl,
        payment_date: paymentDate,
        status: attachmentUrl ? 'under_review' : undefined,
        updated_at: dayjs().toDate(),
      },
    });

    if (updated) {
      await dbSupabase.affidavit.updateMany({
        where: {
          id: {
            in: invoiceData.affidavit.map((a) => a.id),
          },
        },
        data: {
          status: 'under_review',
          updated_at: dayjs().toDate(),
        },
      });
    }

    response.data = updated;
  } catch (error) {
    console.error(error);
    response.success = false;

    if (error instanceof Error) {
      response.error = error.message;
    } else {
      response.error = 'Hubo un error al actualizar la factura';
    }
  } finally {
    return response;
  }
};

export const getInvoices = async (input: {
  page?: number;
  items_per_page?: number;
  status?: 'pending_payment' | 'paid' | 'defeated';
  order_by?: Prisma.invoiceOrderByWithRelationInput;
}) => {
  const response: Envelope<InvoiceWithRelations[]> = {
    success: true,
    data: null,
    error: null,
    pagination: null,
  };

  try {
    const { user } = await getUserAndCommercialEnablement();

    const queries: Prisma.invoiceFindManyArgs = {
      where: {
        user: { id: user.id },
        affidavit: {
          some: {
            declarable_tax_id: 'commercial_activity',
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
      take: 5,
    };

    if (input.items_per_page) {
      queries.take = +input.items_per_page;
    }

    if (input.page) {
      queries.skip = (+input.page - 1) * (queries.take ?? 5);
    }

    if (input.status) {
      switch (input.status) {
        case 'pending_payment':
          queries.where = {
            ...queries.where,
            payment_date: null,
          };
          break;
        case 'paid':
          queries.where = {
            ...queries.where,
            payment_date: {
              not: null,
            },
          };
          break;
        case 'defeated':
          queries.where = {
            ...queries.where,
            payment_date: null,
            due_date: {
              lt: dayjs().toDate(),
            },
          };
          break;
      }
    }

    if (input.order_by) {
      queries.orderBy = input.order_by;
    }

    const [invoices, totalItems] = await Promise.all([
      dbSupabase.invoice.findMany({
        ...queries,
        include: {
          affidavit: true,
          tax_penalties: true,
        },
      }),
      dbSupabase.invoice.count({
        where: queries.where,
      }),
    ]);

    response.data = invoices;
    response.pagination = {
      totalPages: Math.ceil(totalItems / (queries.take ?? 5)),
      totalItems,
      page: input.page ? +input.page : 1,
      limit: queries.take ?? 5,
    };
  } catch (error) {
    console.error(error);
    response.success = false;

    if (error instanceof Error) {
      response.error = error.message;
    } else {
      response.error = 'Hubo un error al obtener las facturas';
    }
  } finally {
    return response;
  }
};

export const getInvoice = async (input: {
  invoice_id: string;
  concepts?: boolean;
}) => {
  const { invoice_id, concepts = false } = input;

  const response: Envelope<
    InvoiceWithRelations & { concepts: ConceptToPay[] }
  > = {
    success: true,
    data: null,
    error: null,
    pagination: null,
  };

  try {
    const invoice = await dbSupabase.invoice.findFirst({
      where: { id: invoice_id },
      include: {
        affidavit: true,
        tax_penalties: true,
        user: true,
      },
    });

    if (!invoice) {
      throw new Error('No se encontró la factura');
    }

    const concepts: ConceptToPay[] = [];

    for (const affidavit of invoice.affidavit) {
      concepts.push({
        id: affidavit.id,
        concept: 'DDJJ Actividad Comercial',
        period: formatName(dayjs(affidavit.period).format('MMMM YYYY')),
        amount: affidavit.fee_amount,
        dueDate: dayjs(affidavit.payment_due_date).format('DD/MM/YYYY'),
      });
    }

    for (const penalty of invoice.tax_penalties) {
      concepts.push({
        id: penalty.id,
        concept: 'Multa',
        period: formatName(dayjs(penalty.period).format('MMMM YYYY')),
        amount: penalty.amount,
        dueDate: dayjs(penalty.created_at).format('DD/MM/YYYY'),
      });
    }

    const resarcitoryInterest = invoice.compensatory_interest ?? 0;

    if (resarcitoryInterest > 0) {
      concepts.push({
        id: 'resarcitory_interest',
        concept: 'Intereses compensatorios',
        period: formatName(dayjs().format('MMMM YYYY')),
        amount: resarcitoryInterest,
        dueDate: dayjs().format('DD/MM/YYYY'),
      });
    }

    response.data = {
      ...invoice,
      concepts,
    };
  } catch (error) {
    console.error(error);
    response.success = false;

    if (error instanceof Error) {
      response.error = error.message;
    } else {
      response.error = 'Hubo un error al obtener la factura';
    }
  } finally {
    return response;
  }
};

export const getUserAndCommercialEnablement = async () => {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (!user || error) {
      if (error) {
        throw new Error(error.message);
      }
      throw new Error('No se pudo obtener el usuario');
    }

    let commercial_enablement:
      | (commercial_enablement & {
          commercial_activity: commercial_activity | null;
        })
      | null = null;
    let include_both_categories = false;

    const c_e_records = await dbSupabase.commercial_enablement.findMany({
      where: {
        tax_id: user.user_metadata.tax_id,
      },
      include: {
        commercial_activity: true,
      },
    });

    if (c_e_records.length > 1) {
      const categories = {
        commercial: false,
        financial: false,
      };

      c_e_records.forEach((c_e_record) => {
        if (c_e_record.commercial_activity?.code === '641930') {
          categories.financial = true;
        } else {
          categories.commercial = true;
        }
      });

      include_both_categories = categories.commercial && categories.financial;
    }

    commercial_enablement = c_e_records[0];

    return { user, commercial_enablement, include_both_categories };
  } catch (error: any) {
    console.error(error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error(
      'Hubo un error al obtener el usuario y la habilitación comercial'
    );
  }
};

export const uploadPaymentProof = async (input: {
  invoice_id: string;
  file: File;
}) => {
  const { invoice_id, file } = input;

  try {
    const supabase = await createSupabaseServerClient();

    const { data: fileUploaded, error: fileUploadError } =
      await supabase.storage.from('payment_proof').upload(invoice_id, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (fileUploadError) {
      throw new Error(fileUploadError.message);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('payment_proof').getPublicUrl(fileUploaded.path);

    return publicUrl;
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Hubo un error al subir el comprobante de pago');
    }
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

const getLastInvoiceCode = async () => {
  try {
    const lastInvoice = await dbSupabase.invoice.findFirst({
      where: {
        id: {
          startsWith: `${dayjs().year()}-`,
        },
      },
      orderBy: {
        id: 'desc',
      },
      select: {
        id: true,
      },
    });

    const code = generateInvoiceCode(lastInvoice?.id);

    return code;
  } catch (error) {
    console.error(error);
    throw new Error('Hubo un error al obtener el último código de factura');
  }
};
