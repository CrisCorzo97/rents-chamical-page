'use server';

import { NextResponse } from 'next/server';
import dbSupabase from '@/lib/prisma/prisma';
import dayjs from 'dayjs';
import { PeriodData } from '@/app/(client)/(sections)/tramites/lib';
import axios from 'axios';

const getPeriodsToCheckForPenalties = async (
  declarable_tax_id: string
): Promise<PeriodData[]> => {
  try {
    const declarableTax = await dbSupabase.declarable_tax.findFirst({
      where: { id: declarable_tax_id },
      include: {
        declarable_tax_period: {
          where: {
            submission_due_date: {
              lte: dayjs().toDate(),
            },
          },
          select: {
            period: true,
            submission_due_date: true,
          },
        },
      },
    });

    if (!declarableTax) {
      throw new Error('No se encontró el impuesto declarable');
    }

    const periods: PeriodData[] = declarableTax.declarable_tax_period.map(
      (period) => ({
        period: period.period,
        dueDate: dayjs(period.submission_due_date).format('YYYY-MM-DD'),
        enabled: true,
      })
    );

    return periods.sort((a, b) =>
      dayjs(a.dueDate).isBefore(dayjs(b.dueDate)) ? -1 : 1
    );
  } catch (error) {
    console.error(error);
    throw new Error('Error al generar períodos a controlar');
  }
};

export async function GET(request: Request) {
  const BASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

  try {
    const commercialActivityPeriods = await getPeriodsToCheckForPenalties(
      'commercial_activity'
    );

    const body: Record<string, PeriodData[]> = {
      commercial_activity: commercialActivityPeriods,
    };

    const response = await axios.post(
      `${BASE_URL}/functions/v1/generate-tax-penalties`,
      JSON.stringify(body),
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY}`,
        },
      }
    );

    return NextResponse.json({
      status: 200,
      body: response.data,
    });
  } catch (error: any) {
    console.error(error.response.data);
    throw new Error('Hubo un error al actualizar los intereses');
  }
}
