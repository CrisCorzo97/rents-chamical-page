import dbSupabase from '@/lib/prisma/prisma';
import { getFirstBusinessDay } from '@/lib/providers';
import { declaration_period } from '@prisma/client';
import dayjs from 'dayjs';

export type PeriodData = {
  period: string;
  dueDate: string;
};

export const PERIOD_MAP: Record<declaration_period, number> = {
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

    const presentationPeriodicity =
      PERIOD_MAP[declarableTax.presentation_periodicity];

    const startDate = dayjs(declarableTax.valid_since);
    const today = dayjs();
    const endDate = declarableTax.valid_until
      ? dayjs(declarableTax.valid_until)
      : null;

    // Si aún estamos en el primer período, no hay vencimientos
    if (today.isBefore(startDate.add(presentationPeriodicity, 'month')))
      return [];

    let periods: PeriodData[] = [];
    let periodStart = startDate;

    while (
      periodStart.isBefore(today) &&
      (!endDate || periodStart.isBefore(endDate))
    ) {
      const presentationPeriodEnd = periodStart
        .add(presentationPeriodicity, 'month')
        .subtract(1, 'day');
      const tentativeDueDate = presentationPeriodEnd
        .add(1, 'month')
        .date(Number(declarableTax.procedure_expiration_day));
      const dueDate = await getFirstBusinessDay(
        tentativeDueDate.format('YYYY-MM-DD')
      );

      if (today.isAfter(presentationPeriodEnd)) {
        periods.push({
          period: `${periodStart.format('YYYY-MM')}`,
          dueDate,
        });
      }

      periodStart = periodStart.add(presentationPeriodicity, 'month');
    }

    const declaredPeriods = await dbSupabase.affidavit.findMany({
      where: {
        user: { id: userId },
        declarable_tax_id: declarableTaxId,
      },
      select: { period: true },
    });

    const filteredPeriods = periods.filter(
      (p) => !declaredPeriods.some((d) => d.period.includes(p.period))
    );

    return filteredPeriods.sort((a, b) => {
      return dayjs(a.dueDate).isAfter(dayjs(b.dueDate)) ? -1 : 1;
    });
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error('Hubo un error al obtener las declaraciones pendientes');
  }
};

export const getPeriods = (periodicity: declaration_period) => {
  // Necesito una función que me devuelva los períodos seleccionables para una declaración dentro de un año
  // en base a la periodicidad del impuesto declarable
  // Por ejemplo, si la periodicidad es mensual, debería devolver los últimos 12 meses en formato YYYY-MM
  // Si la periodicidad es bimestral, debería devolver los últimos 6 bimestres en formato YYYY-MM/YYYY-MM
  // Si la periodicidad es trimestral, debería devolver los últimos 4 trimestres en formato YYYY-MM/YYYY-MM/YYYY-MM
  // Si la periodicidad es cuatrimestral, debería devolver los últimos 3 cuatrimestres en formato YYYY-MM/YYYY-MM/YYYY-MM/YYYY-MM

  const periods = [];
  const currentDate = dayjs();

  for (let i = 0; i < 12 / PERIOD_MAP[periodicity]; i++) {
    const periodStart = currentDate.subtract(
      i * PERIOD_MAP[periodicity],
      'month'
    );

    const dates = [];

    for (let j = 0; j < PERIOD_MAP[periodicity]; j++) {
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
