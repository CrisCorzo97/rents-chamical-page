'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarClock, AlertTriangle } from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { PeriodData } from '../../lib';
dayjs.locale('es');

interface UpcomingDueDatesProps {
  upcomingDueDatePeriods: PeriodData[];
}

export default function UpcomingDueDates({
  upcomingDueDatePeriods,
}: UpcomingDueDatesProps) {
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
          {upcomingDueDatePeriods.map((p) => {
            const dueDate = dayjs(p.dueDate);
            const daysUntilDue = dueDate.diff(dayjs(), 'day');

            return (
              <div
                key={p.period}
                className='flex items-center justify-between p-4 bg-blue-100 rounded-lg'
              >
                <div>
                  <div className='font-medium'>
                    {dayjs(p.period).format('MMMM YYYY')}
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
