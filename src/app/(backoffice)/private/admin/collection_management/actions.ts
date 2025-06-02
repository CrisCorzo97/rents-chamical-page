'use server';

import dbSupabase from '@/lib/prisma/prisma';
import { Envelope, PaginationParams } from '@/types/envelope';
import { InvoiceWithRelations } from './collection_management.interface';
import { affidavit_status, invoice, Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import { uploadPaymentProof } from '@/app/(client)/(sections)/tramites/DDJJ-actividad-comercial/affidavit.actions';
import { revalidatePath } from 'next/cache';
import { formatCuilInput } from '@/lib/formatters';

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
        payment_date: dayjs().toDate(),
        updated_at: dayjs().toDate(),
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
              approved_at: dayjs().toDate(),
              updated_at: dayjs().toDate(),
            },
          }),
          dbSupabase.tax_penalties.updateMany({
            where: {
              invoice_id: invoice.id,
            },
            data: {
              payment_date: dayjs().toDate(),
              updated_at: dayjs().toDate(),
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
        updated_at: dayjs().toDate(),
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
              updated_at: dayjs().toDate(),
            },
          }),
          dbSupabase.tax_penalties.updateMany({
            where: {
              invoice_id: invoice.id,
            },
            data: {
              payment_date: null,
              updated_at: dayjs().toDate(),
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
        payment_date: dayjs().toDate(),
        updated_at: dayjs().toDate(),
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
              approved_at: dayjs().toDate(),
              updated_at: dayjs().toDate(),
            },
          }),
          dbSupabase.tax_penalties.updateMany({
            where: {
              invoice_id: invoice.id,
            },
            data: {
              payment_date: dayjs().toDate(),
              updated_at: dayjs().toDate(),
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
