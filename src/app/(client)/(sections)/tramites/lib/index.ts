import dbSupabase from '@/lib/prisma/prisma';
import { getFirstBusinessDay } from '@/lib/providers';
import { declaration_period } from '@prisma/client';
import dayjs from 'dayjs';

export type PeriodData = {
  period: string;
  dueDate: string;
  enabled: boolean;
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
  commercialEnablementRegistrationDate: string;
}) => {
  const { declarableTaxId, userId, commercialEnablementRegistrationDate } =
    input;

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
    const registrationDate = dayjs(commercialEnablementRegistrationDate);

    // Si aún estamos en el primer período, no hay vencimientos
    if (today.isBefore(startDate.add(presentationPeriodicity, 'month')))
      return [];

    let periods: PeriodData[] = [];
    let periodStart = startDate.startOf('month');

    // Ajustar el inicio del período si la fecha de alta es posterior
    if (registrationDate.isAfter(periodStart)) {
      periodStart = registrationDate.startOf('month');
    }

    while (
      periodStart.isBefore(today) &&
      (!endDate || periodStart.isBefore(endDate))
    ) {
      let tentativeDueDate = dayjs('2025-04-10');

      switch (periodStart.month()) {
        case 0:
        case 1:
          tentativeDueDate = dayjs('2025-04-10');
          break;
        case 2:
        case 3:
          tentativeDueDate = dayjs('2025-06-04');
          break;
        case 4:
        case 5:
          tentativeDueDate = dayjs('2025-08-04');
          break;
        case 6:
        case 7:
          tentativeDueDate = dayjs('2025-10-04');
          break;
        case 8:
        case 9:
          tentativeDueDate = dayjs('2025-12-04');
          break;
        case 10:
        case 11:
          tentativeDueDate = dayjs('2026-02-04');
          break;
        default:
          tentativeDueDate = dayjs('2025-04-10');
          break;
      }

      const dueDate = await getFirstBusinessDay(
        tentativeDueDate.format('YYYY-MM-DD')
      );

      if (today.isAfter(dayjs(dueDate).subtract(1, 'month'))) {
        periods.push({
          period: `${periodStart.format('YYYY-MM')}`,
          dueDate,
          enabled: false,
        });
      }

      periodStart = periodStart.add(1, 'month');
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

    // Ordenar períodos por fecha y habilitar solo el más antiguo
    const sortedPeriods = filteredPeriods.sort((a, b) => {
      return dayjs(a.period).isAfter(dayjs(b.period)) ? 1 : -1;
    });

    if (sortedPeriods.length > 0) {
      sortedPeriods[0].enabled = true;
    }

    return sortedPeriods;
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
