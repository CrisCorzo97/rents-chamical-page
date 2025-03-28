'use client';

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatName } from '@/lib/formatters';
import { buildQuery } from '@/lib/url';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { ArrowRight, CalendarClock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PeriodData } from '../../lib';

dayjs.locale('es');
dayjs.extend(customParseFormat);

interface DuePeriodsCardProps {
  periods: PeriodData[];
}

export function DuePeriodsCard({ periods }: DuePeriodsCardProps) {
  const isOverdue = (period: PeriodData) => {
    const dueDate = dayjs(period.dueDate);
    const today = dayjs();
    return dueDate.isBefore(today);
  };

  const { push } = useRouter();

  if (!periods || periods.length === 0) {
    return (
      <Card className='w-full md:col-span-3'>
        <CardHeader>
          <CardTitle className='text-xl font-semibold'>Vencimientos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col items-center justify-center py-8 text-center'>
            <CalendarClock className='h-12 w-12 text-muted-foreground/50 mb-4' />
            <h3 className='text-lg font-semibold text-muted-foreground mb-2'>
              No hay vencimientos pendientes
            </h3>
            <p className='text-sm text-muted-foreground'>
              Estás al día con tus pagos. Te notificaremos cuando haya nuevos
              vencimientos.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='w-full md:col-span-3'>
      <CardHeader>
        <CardTitle className='text-lg font-medium'>
          Vencimientos de tu declaraciones
        </CardTitle>
      </CardHeader>
      <CardContent className='-mt-3'>
        <ScrollArea className='h-44'>
          <div className='space-y-2'>
            {periods.map((period, index) => (
              <div
                key={index}
                className='w-5/6 flex items-center justify-between rounded-lg border px-3 py-2'
              >
                <div>
                  <div className='font-medium'>
                    {formatName(dayjs(period.period, 'YYYY-MM').format('MMMM'))}
                  </div>
                  <div className='flex items-center gap-2'>
                    <span className='text-sm text-muted-foreground'>
                      {dayjs(period.dueDate).format('DD/MM')}
                    </span>
                    {isOverdue(period) && (
                      <Badge variant='destructive' className='text-xs'>
                        Vencido
                      </Badge>
                    )}
                  </div>
                </div>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() =>
                    push(
                      `/tramites/DDJJ-actividad-comercial/presentar${buildQuery(
                        {
                          period: dayjs(period.period, 'YYYY-MM').format(
                            'MMMM-YYYY'
                          ),
                        }
                      )}`
                    )
                  }
                >
                  Presentar
                  <ArrowRight className='h-5 w-5 ml-2' />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
