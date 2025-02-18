import dbSupabase from '@/lib/prisma/prisma';
import { declarable_tax } from '@prisma/client';
import dayjs from 'dayjs';

export type PeriodData = {
  period: string;
  dueDate: string;
};

const periodMap: Record<declarable_tax['periodicity'], number> = {
  month: 1,
  bimester: 2,
  quarter: 3,
  four_month: 4,
  semester: 6,
  year: 12,
};

export const getPendingDeclarations = async (input: {
  declarableTaxId: string;
  userId: string;
}) => {
  const { declarableTaxId, userId } = input;

  try {
    const declarableTax = await dbSupabase.declarable_tax.findFirst({
      where: {
        id: declarableTaxId,
      },
    });

    if (!declarableTax) {
      throw new Error('No se encontró el impuesto declarable');
    }

    const startDate = dayjs(declarableTax.valid_since);
    const today = dayjs();
    const endDate = declarableTax.valid_until
      ? dayjs(declarableTax.valid_until)
      : null;

    // Si aún estamos en el primer período, no hay vencimientos
    if (today.isBefore(startDate.add(2, 'month'))) return [];

    let periods: PeriodData[] = [];
    let periodStart = startDate;

    while (
      periodStart.isBefore(today) &&
      (!endDate || periodStart.isBefore(endDate))
    ) {
      const periodEnd = periodStart.add(2, 'month').subtract(1, 'day');
      const dueDate = periodEnd
        .add(1, 'month')
        .date(Number(declarableTax.procedure_expiration_day));

      if (today.isAfter(periodEnd)) {
        periods.push({
          period: `${periodStart.format('YYYY-MM')}/${periodEnd.format(
            'YYYY-MM'
          )}`,
          dueDate: dueDate.format('YYYY-MM-DD'),
        });
      }

      periodStart = periodStart.add(2, 'month');
    }

    const declaredPeriods = await dbSupabase.affidavit.findMany({
      where: {
        user: { id: userId },
        declarable_tax_id: declarableTaxId,
      },
      select: { period: true },
    });

    return periods.filter(
      (p) => !declaredPeriods.some((d) => d.period === p.period)
    );
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error('Hubo un error al obtener las declaraciones pendientes');
  }
};

export const getPeriods = (periodicity: declarable_tax['periodicity']) => {
  // Necesito una función que me devuelva los períodos seleccionables para una declaración dentro de un año
  // en base a la periodicidad del impuesto declarable
  // Por ejemplo, si la periodicidad es mensual, debería devolver los últimos 12 meses en formato YYYY-MM
  // Si la periodicidad es bimestral, debería devolver los últimos 6 bimestres en formato YYYY-MM/YYYY-MM
  // Si la periodicidad es trimestral, debería devolver los últimos 4 trimestres en formato YYYY-MM/YYYY-MM/YYYY-MM
  // Si la periodicidad es cuatrimestral, debería devolver los últimos 3 cuatrimestres en formato YYYY-MM/YYYY-MM/YYYY-MM/YYYY-MM

  const periods = [];
  const currentDate = dayjs();

  for (let i = 0; i < 12 / periodMap[periodicity]; i++) {
    const periodStart = currentDate.subtract(
      i * periodMap[periodicity],
      'month'
    );

    const dates = [];

    for (let j = 0; j < periodMap[periodicity]; j++) {
      dates.push({
        value: periodStart.add(j, 'month').format('YYYY-MM'),
        label: periodStart.add(j, 'month').format('MMMM'),
      });
    }

    periods.push({
      value: dates.map((d) => d.value).join('/'),
      label: `${dates.map((d) => d.label).join(' - ')} ${periodStart.format(
        'YYYY'
      )}`,
    });
  }

  return periods;
};
