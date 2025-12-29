'use server';

import { generateInvoiceCode } from '@/lib/code-generator';
import { formatName } from '@/lib/formatters';
import dbSupabase from '@/lib/prisma/prisma';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Envelope, PaginationParams } from '@/types/envelope';
import { affidavit_status, invoice, Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import { revalidatePath } from 'next/cache';
import { getTaxpayerData } from '../../lib/get-taxpayer-data';
import { CalculateInfo } from '../../mis-declaraciones/types/affidavits.types';
import { ConceptToPay, InvoiceWithRelations } from '../types/types';

export const getInvoices = async ({
  page = 1,
  limit = 10,
  sort_by = 'created_at',
  sort_direction = 'desc',
  filters,
}: PaginationParams) => {
  const response: Envelope<InvoiceWithRelations[]> = {
    success: true,
    data: null,
    error: null,
    pagination: null,
  };

  try {
    const { user } = await getTaxpayerData();

    const queries: Prisma.invoiceFindManyArgs = {
      where: {
        taxpayer_id: user.id,
      },
      orderBy: {
        [sort_by]: sort_direction,
      },
      skip: (page - 1) * limit,
      take: limit,
    };

    if (filters) {
      const { status } = filters;

      queries.where = {
        ...queries.where,
        status: status as affidavit_status,
      };
    }

    const [invoices, total_items] = await Promise.all([
      dbSupabase.invoice.findMany({
        ...queries,
        include: {
          affidavit: {
            include: {
              declarable_tax: true,
            },
          },
          tax_penalties: {
            include: {
              declarable_tax: true,
            },
          },
        },
      }),
      dbSupabase.invoice.count({
        where: queries.where,
      }),
    ]);

    response.data = invoices;
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
      response.error = 'Ha ocurrido un error al obtener los pagos';
    }
  }

  return response;
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
        affidavit: {
          include: {
            declarable_tax: true,
          },
        },
        tax_penalties: {
          include: {
            declarable_tax: true,
          },
        },
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

export const getConceptsToPay = async () => {
  const response: Envelope<ConceptToPay[]> = {
    success: true,
    data: null,
    error: null,
    pagination: null,
  };

  try {
    const { user } = await getTaxpayerData();

    const lte_payment_due_date = dayjs().add(2, 'month').toDate();

    const affidavits = await dbSupabase.affidavit.findMany({
      where: {
        status: {
          in: ['pending_payment', 'refused'],
        },
        taxpayer_id: user.id,
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

    const taxPenalties = await dbSupabase.tax_penalties.findMany({
      where: {
        user: { id: user.id },
        declarable_tax_id: 'commercial_activity',
      },
    });

    if (!Array.isArray(taxPenalties)) {
      throw new Error('No se encontraron multas pendientes de pago');
    }

    const concepts: ConceptToPay[] = [];

    for (const affidavit of affidavits) {
      concepts.push({
        id: affidavit.id,
        concept: 'DDJJ Actividad Comercial',
        period: affidavit.period,
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
    const { user } = await getTaxpayerData();

    const declarableTax = await dbSupabase.declarable_tax.findFirst({
      where: {
        id: 'commercial_activity',
      },
      include: {
        declarable_tax_period: true,
      },
    });

    if (!declarableTax) {
      throw new Error('No se encontró el impuesto declarable');
    }

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
      if (affidavit.period === '2025-10-01') return acc;

      const declarableTaxPeriod = declarableTax.declarable_tax_period.find(
        (period) => period.period === affidavit.period
      );
      const paymentDueDate = dayjs(affidavit.payment_due_date).isAfter(
        dayjs(declarableTaxPeriod?.payment_due_date),
        'day'
      )
        ? dayjs(affidavit.payment_due_date)
        : dayjs(declarableTaxPeriod?.payment_due_date);

      const days = dayjs().diff(dayjs(paymentDueDate), 'day');
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
    response.success = false;
    if (error instanceof Error) {
      response.error = error.message;
    } else {
      response.error = 'Ha ocurrido un error al crear la factura';
    }
  }

  return response;
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
    const { user } = await getTaxpayerData();

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

    revalidatePath('/mis-pagos');
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
