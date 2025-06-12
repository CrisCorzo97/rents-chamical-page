import dbSupabase from '@/lib/prisma/prisma';
import { Envelope, PaginationParams } from '@/types/envelope';
import { InvoiceWithRelations } from '../types/types';
import { getTaxpayerData } from '../../lib/get-taxpayer-data';
import { affidavit_status, Prisma } from '@prisma/client';

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
