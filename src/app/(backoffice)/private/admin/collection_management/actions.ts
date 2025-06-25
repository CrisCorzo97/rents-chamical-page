'use server';

import dbSupabase from '@/lib/prisma/prisma';
import { Envelope, PaginationParams } from '@/types/envelope';
import { InvoiceWithRelations } from './collection_management.interface';
import {
  affidavit,
  affidavit_status,
  invoice,
  Prisma,
  user,
} from '@prisma/client';
import dayjs from 'dayjs';
import { uploadPaymentProof } from '@/app/(client)/(sections)/tramites/DDJJ-actividad-comercial/affidavit.actions';
import { revalidatePath } from 'next/cache';
import { formatCuilInput } from '@/lib/formatters';
import utc from 'dayjs/plugin/utc';
import { CalculateInfo } from '@/app/(client)/(sections)/tramites/DDJJ-actividad-comercial/types';
import { generateInvoiceCode } from '@/lib/code-generator';
dayjs.extend(utc);

export const getInvoicesWithRelations = async ({
  page,
  limit,
  sort_by,
  sort_direction,
  filters,
}: PaginationParams) => {
  const response: Envelope<InvoiceWithRelations[]> = {
    success: true,
    data: null,
    error: null,
    pagination: null,
  };

  try {
    const queries: Prisma.invoiceFindManyArgs = {
      orderBy: {
        created_at: 'desc',
      },
      take: limit ?? 8,
    };

    if (page) {
      queries.skip = (+page - 1) * (queries.take ?? 8);
    }

    if (filters) {
      const { status, id, user, tax_id } = filters;
      queries.where = {
        ...queries.where,
        ...(status && { status: status as affidavit_status }),
        ...(id && {
          id: {
            contains: id as string,
          },
        }),
        ...(user && {
          user: {
            OR: [
              {
                first_name: {
                  contains: user as string,
                  mode: 'insensitive',
                },
              },
              {
                last_name: {
                  contains: user as string,
                  mode: 'insensitive',
                },
              },
            ],
          },
        }),
        ...(tax_id && {
          user: {
            OR: [
              {
                cuil: {
                  contains: formatCuilInput(tax_id as string),
                },
              },
              {
                cuil: {
                  contains: tax_id as string,
                },
              },
            ],
          },
        }),
      };
    }

    if (sort_by) {
      queries.orderBy = {
        [sort_by]: sort_direction ?? 'desc',
      };
    }

    const [invoices, totalItems] = await Promise.all([
      dbSupabase.invoice.findMany({
        ...queries,
        include: {
          user: true,
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
      totalPages: Math.ceil(totalItems / (queries.take ?? 8)),
      totalItems,
      page: page ? +page : 1,
      limit: queries.take ?? 8,
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

export const acceptPayment = async (invoice: InvoiceWithRelations) => {
  const response: Envelope<invoice> = {
    success: true,
    data: null,
    error: null,
    pagination: null,
  };

  try {
    const updated = await dbSupabase.invoice.update({
      where: {
        id: invoice.id,
      },
      data: {
        status: 'approved',
        payment_date: dayjs.utc().toDate(),
        updated_at: dayjs.utc().toDate(),
        affidavit: {
          updateMany: {
            where: {
              invoice_id: invoice.id,
            },
            data: {
              status: 'approved',
              approved_at: dayjs.utc().toDate(),
              updated_at: dayjs.utc().toDate(),
            },
          },
        },
        tax_penalties: {
          updateMany: {
            where: {
              invoice_id: invoice.id,
            },
            data: {
              payment_date: dayjs.utc().toDate(),
              updated_at: dayjs.utc().toDate(),
            },
          },
        },
      },
    });

    // if (updated) {
    //   try {
    //     Promise.all([
    //       dbSupabase.affidavit.updateMany({
    //         where: {
    //           invoice_id: invoice.id,
    //         },
    //         data: {
    //           status: 'approved',
    //           approved_at: dayjs().toDate(),
    //           updated_at: dayjs().toDate(),
    //         },
    //       }),
    //       dbSupabase.tax_penalties.updateMany({
    //         where: {
    //           invoice_id: invoice.id,
    //         },
    //         data: {
    //           payment_date: dayjs().toDate(),
    //           updated_at: dayjs().toDate(),
    //         },
    //       }),
    //     ]);
    //   } catch (error) {
    //     console.error(error);
    //   }
    // }

    response.data = updated;

    revalidatePath('/private/admin/collection_management');
  } catch (error) {
    console.error(error);
    response.success = false;

    if (error instanceof Error) {
      response.error = error.message;
    } else {
      response.error = 'Hubo un error al aceptar el pago';
    }
  } finally {
    return response;
  }
};

export const rejectPayment = async (invoice: InvoiceWithRelations) => {
  const response: Envelope<invoice> = {
    success: true,
    data: null,
    error: null,
    pagination: null,
  };

  try {
    const updated = await dbSupabase.invoice.update({
      where: {
        id: invoice.id,
      },
      data: {
        status: 'refused',
        payment_date: null,
        updated_at: dayjs.utc().toDate(),
      },
    });

    if (updated) {
      try {
        Promise.all([
          dbSupabase.affidavit.updateMany({
            where: {
              invoice_id: invoice.id,
            },
            data: {
              status: 'refused',
              updated_at: dayjs.utc().toDate(),
            },
          }),
          dbSupabase.tax_penalties.updateMany({
            where: {
              invoice_id: invoice.id,
            },
            data: {
              payment_date: null,
              updated_at: dayjs.utc().toDate(),
            },
          }),
        ]);
      } catch (error) {
        console.error(error);
      }
    }

    response.data = updated;
  } catch (error) {
    console.error(error);
    response.success = false;

    if (error instanceof Error) {
      response.error = error.message;
    } else {
      response.error = 'Hubo un error al rechazar el pago';
    }
  } finally {
    return response;
  }
};

export const uploadAttachment = async (input: {
  invoice: InvoiceWithRelations;
  attachment: File;
}) => {
  const { invoice, attachment } = input;

  const response: Envelope<invoice> = {
    success: true,
    data: null,
    error: null,
    pagination: null,
  };

  try {
    const uploadedAttachment = await uploadPaymentProof({
      file: attachment,
      invoice_id: invoice.id,
    });

    const updated = await dbSupabase.invoice.update({
      where: {
        id: invoice.id,
      },
      data: {
        attached_receipt: uploadedAttachment,
        status: 'approved',
        payment_date: dayjs.utc().toDate(),
        updated_at: dayjs.utc().toDate(),
      },
    });

    if (updated) {
      try {
        Promise.all([
          dbSupabase.affidavit.updateMany({
            where: {
              invoice_id: invoice.id,
            },
            data: {
              status: 'approved',
              approved_at: dayjs.utc().toDate(),
              updated_at: dayjs.utc().toDate(),
            },
          }),
          dbSupabase.tax_penalties.updateMany({
            where: {
              invoice_id: invoice.id,
            },
            data: {
              payment_date: dayjs.utc().toDate(),
              updated_at: dayjs.utc().toDate(),
            },
          }),
        ]);
      } catch (error) {
        console.error(error);
      }
    }

    response.data = updated;

    revalidatePath('/private/admin/collection_management');
  } catch (error) {
    console.error(error);
    response.success = false;

    if (error instanceof Error) {
      response.error = error.message;
    } else {
      response.error = 'Hubo un error al subir el archivo';
    }
  } finally {
    return response;
  }
};

export const getPendingAffidavits = async (taxId: string) => {
  const response: Envelope<(affidavit & { user: user | null })[]> = {
    success: true,
    data: null,
    error: null,
    pagination: null,
  };

  try {
    const lte_payment_due_date = dayjs().endOf('month').toDate();

    const affidavits = await dbSupabase.affidavit.findMany({
      where: {
        tax_id: taxId,
        status: 'pending_payment',
        payment_due_date: {
          lte: lte_payment_due_date,
        },
      },
      include: {
        user: true,
      },
    });

    response.data = affidavits;
  } catch (error) {
    console.error(error);
    response.success = false;

    if (error instanceof Error) {
      response.error = error.message;
    } else {
      response.error = 'Hubo un error al obtener las declaraciones pendientes';
    }
  } finally {
    return response;
  }
};

export const createInvoice = async (input: {
  user_id: string;
  affidavit_ids: string[];
}) => {
  const { user_id, affidavit_ids } = input;

  const response: Envelope<invoice> = {
    success: true,
    data: null,
    error: null,
    pagination: null,
  };

  try {
    const declarableTax = await dbSupabase.declarable_tax.findFirst({
      where: {
        id: 'commercial_activity',
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
        user: { id: user_id },
      },
      orderBy: {
        payment_due_date: 'desc',
      },
    });

    // Calculo el monto total de las declaraciones y lo sumo con las multas
    const feeAmount = affidavits.reduce(
      (acc, affidavit) => acc + affidavit.fee_amount,
      0
    );

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
      ? dayjs().endOf('day').toDate()
      : affidavits[0].payment_due_date;

    const invoice = await dbSupabase.invoice.create({
      data: {
        id: invoiceId,
        fee_amount: feeAmount,
        compensatory_interest: interests,
        total_amount: totalAmount,
        due_date,
        status: 'pending_payment',
        user: {
          connect: {
            id: user_id,
          },
        },
        affidavit: {
          connect: affidavit_ids.map((id) => ({ id })),
        },
      },
    });

    response.data = invoice;
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
