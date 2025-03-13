import dayjs from 'dayjs';

interface DeclarableTax {
  id: string;
  periodicity: 'month' | 'bimester' | 'trimester' | 'quad' | 'semester';
  procedure_expiration_day: number;
  valid_since: string;
  valid_until?: string;
}

type PeriodData = {
  period: string;
  dueDate: string;
};

const getPendingDeclarations = (
  tax: DeclarableTax,
  declaredPeriods: PeriodData[],
  currentDate: string
) => {
  const startDate = dayjs(tax.valid_since);
  const today = dayjs(currentDate);
  const endDate = tax.valid_until ? dayjs(tax.valid_until) : null;

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
      .date(tax.procedure_expiration_day);

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

  return periods.filter(
    (p) => !declaredPeriods.some((d) => d.period === p.period)
  );
};

// Ejemplo de uso
const tax: DeclarableTax = {
  id: 'commercial_activity',
  periodicity: 'bimester',
  procedure_expiration_day: 20,
  valid_since: '2025-01-01',
  valid_until: '2025-12-31',
};

const declaredPeriods: PeriodData[] = [
  // { period: '2025-01/2025-02', dueDate: '2025-03-20' },
];

console.log(getPendingDeclarations(tax, declaredPeriods, '2026-12-01'));
