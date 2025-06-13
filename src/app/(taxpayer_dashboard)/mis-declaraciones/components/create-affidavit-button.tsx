'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import { Button } from '@/components/ui/button';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import locale from 'dayjs/locale/es';
import utc from 'dayjs/plugin/utc';
import { formatName } from '@/lib/formatters';
import Link from 'next/link';
dayjs.locale(locale);
dayjs.extend(utc);

export const CreateAffidavitButton = ({ year }: { year: string }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);

  const periods = useMemo(() => {
    const periods = [];
    for (let i = 0; i < 12; i++) {
      const period = dayjs().utc().month(i).year(Number(year)).startOf('month');
      periods.push({
        label: formatName(period.format('MMMM YYYY')),
        value: period.format('YYYY-MM-DD'),
        enabled: period.isBefore(dayjs().utc().endOf('month')),
      });
    }
    return periods;
  }, [year]);

  const defaultPeriod = useMemo(() => {
    const currentYear = dayjs().utc().year();

    if (currentYear === Number(year)) {
      return dayjs().utc().startOf('month').format('YYYY-MM-DD');
    }

    return dayjs()
      .utc()
      .year(Number(year))
      .startOf('year')
      .format('YYYY-MM-DD');
  }, [year]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size='sm'>Nueva Declaración</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva Declaración</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Elige el período que deseas declarar.
        </DialogDescription>
        <div className='flex flex-col gap-2'>
          <div className='flex flex-col gap-2'>
            <Label>Período</Label>
            <Select
              value={selectedPeriod ?? defaultPeriod}
              onValueChange={setSelectedPeriod}
            >
              <SelectTrigger>
                <SelectValue placeholder='Selecciona un período' />
              </SelectTrigger>
              <SelectContent>
                {periods.map(({ label, value, enabled }) => (
                  <SelectItem key={value} value={value} disabled={!enabled}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline'>Cancelar</Button>
          <Link
            href={`/mis-declaraciones/nueva?period=${
              selectedPeriod ?? defaultPeriod
            }`}
          >
            <Button>Seleccionar</Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
