'use server';

import dbSupabase from '@/lib/prisma/prisma';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Envelope } from '@/types/envelope';
import {
  $Enums,
  affidavit,
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
  ConceptToPay,
  InvoiceWithRelations,
} from './types';
import { AffidavitStatus } from './page';
import { generateInvoiceCode } from '@/lib/code-generator';
import { revalidatePath } from 'next/cache';
import { formatName } from '@/lib/formatters';
dayjs.extend(customParseFormat);
dayjs.locale(locale);

type Subcase = {
  fee: number;
  label: string;
  amount_from: number;
  amount_up_to: number;
};

type Case = {
  category: string;
  subcases: Subcase[];
};

type CalculateInfo = {
  cases: Case[];
  minimun_tax_amount: number;
  compensatory_interest: number;
};

const FINANCIAL_ACTIVITIES = ['Entidades Financieras'];

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

    const [declarations, total_items] = await Promise.all([
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
      total_pages: Math.ceil(total_items / (queries.take ?? 5)),
      total_items,
      page: input.page ? +input.page : 1,
      limit_per_page: queries.take ?? 5,
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

    const [penalties, total_items] = await Promise.all([
      dbSupabase.tax_penalties.findMany({
        ...queries,
      }),
      dbSupabase.tax_penalties.count({
        where: queries.where,
      }),
    ]);

    response.data = penalties;
    response.pagination = {
      total_pages: Math.ceil(total_items / (queries.take ?? 5)),
      total_items,
      page: input.page ? +input.page : 1,
      limit_per_page: queries.take ?? 5,
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
    const { data: affidavits } = await getAffidavits({
      items_per_page: '100',
      filter: {
        status: {
          in: ['pending_payment', 'refused'],
        },
        payment_due_date: {
          lte: dayjs().endOf('month').toDate(),
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
        concept: 'Declaración Jurada',
        period: formatName(dayjs(affidavit.period).format('MMMM-YYYY')),
        amount: affidavit.fee_amount,
        dueDate: dayjs(affidavit.payment_due_date).format('DD/MM/YYYY'),
      });
    }

    for (const penalty of taxPenalties) {
      concepts.push({
        id: penalty.id,
        concept: 'Multa',
        period: formatName(dayjs(penalty.period).format('MMMM-YYYY')),
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
    const { user } = await getUserAndCommercialEnablement();

    response.data = await getPendingDeclarations({
      declarableTaxId: 'commercial_activity',
      userId: user.id,
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

    const affidavits = await dbSupabase.affidavit.findMany({
      where: {
        user: { id: user.id },
        declarable_tax_id: 'commercial_activity',
        status: {
          in: ['pending_payment', 'refused'],
        },
        payment_due_date: {
          lte: dayjs().endOf('month').toDate(),
        },
      },
    });

    response.data = affidavits.reduce((acc, affidavit) => {
      return acc + affidavit.fee_amount;
    }, 0);
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

export const calculateFeeAmount = async (input: { amount: number }) => {
  const { amount } = input;

  let feeAmount = 0;
  let feeAliquot = 0;

  try {
    const { commercial_enablement } = await getUserAndCommercialEnablement();
    const declarableTax = await getDeclarableTax();

    const { cases, minimun_tax_amount } =
      declarableTax.calculate_info as CalculateInfo;

    if (
      FINANCIAL_ACTIVITIES.includes(
        commercial_enablement!.commercial_activity?.activity ?? ''
      )
    ) {
      const feeCase = cases.find(
        (c) =>
          c.category === 'Bancos-Entidades Financieras-Compañías Financieras'
      );
      if (!feeCase) {
        throw new Error('No se encontró el caso para la actividad financiera');
      }

      feeAliquot = feeCase.subcases[0].fee;
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
          feeAliquot = subcase.fee;
          break;
        }
      }
    }

    feeAmount = amount * feeAliquot;

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

    const tentativePaymentDueDate = dayjs(period, 'MMMM-YYYY')
      .add(monthsToAdd, 'month')
      .add(daysToAdd, 'day')
      .date(Number(declarableTax.procedure_expiration_day))
      .format('YYYY-MM-DD');

    const paymentDueDate = await getFirstBusinessDay(tentativePaymentDueDate);

    const affidavitData: Prisma.affidavitCreateInput = {
      tax_id: user.user_metadata.tax_id,
      declarable_tax: {
        connect: { id: 'commercial_activity' },
      },
      declared_amount,
      fee_amount,
      payment_due_date: dayjs(paymentDueDate).toISOString(),
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
  tax_penaltie_ids: string[];
}) => {
  const { affidavit_ids, tax_penaltie_ids } = input;

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
    });

    // Busco las multas en base a los ids
    const taxPenalties = await dbSupabase.tax_penalties.findMany({
      where: {
        id: {
          in: tax_penaltie_ids,
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
      return acc + affidavit.fee_amount * compensatoryInterest * days;
    }, 0);

    // Calculo el monto total de la factura
    const totalAmount = feeAmount + interests;

    const invoiceId = await getLastInvoiceCode();

    if (!invoiceId) {
      throw new Error('No se pudo obtener el código de la factura');
    }

    const invoiceData: Prisma.invoiceCreateInput = {
      id: invoiceId,
      fee_amount: feeAmount,
      compensatory_interest: interests,
      total_amount: totalAmount,
      due_date: dayjs().endOf('day').toDate(),
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
    let interests = undefined;

    if (attachment_file) {
      attachmentUrl = await uploadPaymentProof({
        invoice_id,
        file: attachment_file,
      });
      paymentDate = dayjs().toDate();
    }

    if (dayjs().isAfter(dayjs(invoiceData.due_date), 'day')) {
      const declarableTax = await getDeclarableTax();
      const compensatoryInterest =
        (declarableTax.calculate_info as CalculateInfo)
          ?.compensatory_interest ?? 0;
      interests =
        invoiceData.fee_amount *
        compensatoryInterest *
        dayjs().diff(dayjs(invoiceData.due_date), 'day');
    }

    const updated = await dbSupabase.invoice.update({
      where: { id: invoice_id },
      data: {
        compensatory_interest: interests,
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

    const [invoices, total_items] = await Promise.all([
      dbSupabase.invoice.findMany({
        ...queries,
        include: {
          affidavit: true,
        },
      }),
      dbSupabase.invoice.count({
        where: queries.where,
      }),
    ]);

    response.data = invoices;
    response.pagination = {
      total_pages: Math.ceil(total_items / (queries.take ?? 5)),
      total_items,
      page: input.page ? +input.page : 1,
      limit_per_page: queries.take ?? 5,
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

    const commercial_enablement =
      await dbSupabase.commercial_enablement.findFirst({
        where: {
          tax_id: user.user_metadata.tax_id,
        },
        include: {
          commercial_activity: true,
        },
      });

    return { user, commercial_enablement };
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
