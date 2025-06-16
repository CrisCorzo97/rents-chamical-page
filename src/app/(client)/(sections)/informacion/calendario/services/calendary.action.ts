'use server';

import dbSupabase from '@/lib/prisma/prisma';
import { Envelope } from '@/types/envelope';
import { declarable_tax, declarable_tax_period } from '@prisma/client';
import dayjs from 'dayjs';

export const getDueDates = async () => {
  const response: Envelope<
    (declarable_tax_period & {
      declarable_tax: declarable_tax;
    })[]
  > = {
    success: true,
    data: null,
    error: null,
    pagination: null,
  };

  try {
    const dueDates = await dbSupabase.declarable_tax_period.findMany({
      where: {
        AND: [
          {
            OR: [
              {
                submission_due_date: {
                  gte: dayjs().startOf('month').toDate(),
                },
              },
              {
                payment_due_date: {
                  gte: dayjs().startOf('month').toDate(),
                },
              },
            ],
          },
          {
            payment_due_date: {
              lte: dayjs().add(2, 'month').endOf('month').toDate(),
            },
          },
        ],
      },
      include: {
        declarable_tax: true,
      },
    });

    response.data = dueDates;
    return response;
  } catch (error) {
    response.success = false;
    if (error instanceof Error) {
      response.error = error.message;
    } else {
      response.error = 'Ocurrió un error al obtener las fechas de vencimiento';
    }
  }
  return response;
};
