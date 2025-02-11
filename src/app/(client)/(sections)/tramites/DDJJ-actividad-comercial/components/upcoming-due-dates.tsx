'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarClock, AlertTriangle } from 'lucide-react';
import { Declaration } from '../types';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');

interface UpcomingDueDatesProps {
  declarations: Declaration[];
}

export default function UpcomingDueDates({
  declarations,
}: UpcomingDueDatesProps) {
  const pendingPaymentDeclarations = declarations
    .filter((d) => d.status === 'payment_pending')
    .sort((a, b) => dayjs(a.dueDate).diff(b.dueDate))
    .slice(0, 3);

  const upcomingDeclarations = pendingPaymentDeclarations;
  const lastDeclaration = declarations
    .filter(
      (d) =>
        d.status === 'payment_pending' ||
        dayjs(d.period).isBefore(dayjs(), 'month')
    )
    .sort((a, b) => dayjs(b.period).diff(a.period))[0];

  if (lastDeclaration) {
    let nextPeriod = dayjs(lastDeclaration.period).add(1, 'month');
    while (nextPeriod.isBefore(dayjs(), 'month')) {
      upcomingDeclarations.push({
        id: `new-${nextPeriod.format('YYYY-MM')}`,
        period: nextPeriod.format('YYYY-MM'),
        dueDate: nextPeriod
          .add(1, 'month')
          .startOf('month')
          .add(19, 'day')
          .format('YYYY-MM-DD'),
        status: 'payment_pending',
        grossAmount: 0,
      });
      nextPeriod = nextPeriod.add(1, 'month');
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <CalendarClock className='h-5 w-5' />
          Próximas Fechas de Vencimiento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {upcomingDeclarations.map((declaration) => {
            const dueDate = dayjs(declaration.dueDate);
            const daysUntilDue = dueDate.diff(dayjs(), 'day');

            return (
              <div
                key={declaration.id}
                className='flex items-center justify-between p-4 bg-blue-100 rounded-lg'
              >
                <div>
                  <div className='font-medium'>
                    {dayjs(declaration.period).format('MMMM YYYY')}
                  </div>
                  <div className='text-sm text-gray-500'>
                    Vence: {dueDate.format('DD/MM/YYYY')}
                  </div>
                </div>
                {daysUntilDue <= 5 && (
                  <div className='flex items-center text-red-500'>
                    <AlertTriangle className='h-4 w-4 mr-1' />
                    <span className='text-sm'>{daysUntilDue} días de mora</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
