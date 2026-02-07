'use client';
import {
  Dialog,
  DialogClose,
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
import { Skeleton } from '@/components/ui/skeleton';
import dayjs from 'dayjs';
import locale from 'dayjs/locale/es';
import utc from 'dayjs/plugin/utc';
import Link from 'next/link';
import { useMemo, useState, useTransition } from 'react';
import { toast, Toaster } from 'sonner';
import { getPeriodsToSubmit } from '../services/affidavits.actions';
import { PeriodToSubmit } from '../types/affidavits.types';
dayjs.locale(locale);
dayjs.extend(utc);

export const CreateAffidavitButton = ({
  initialPeriods,
}: {
  initialPeriods: PeriodToSubmit[];
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [periods, setPeriods] = useState<PeriodToSubmit[]>(initialPeriods);
  const [year, setYear] = useState<string>(dayjs().format('YYYY'));

  const [isFetching, startTransition] = useTransition();

  const handleYearChange = (year: string) => {
    startTransition(async () => {
      const { data: periods, error } = await getPeriodsToSubmit(year);

      if (error || !periods) {
        toast.error(
          error ?? 'Ocurrió un error al consultar los períodos habilitados.'
        );
        return;
      }

      setPeriods(periods);
    });
    setYear(year);
  };

  const defaultPeriod = useMemo(() => {
    const nextToSubmitPeriod = periods.find((period) => period.nextToSubmit);

    if (!nextToSubmitPeriod) {
      return periods.findLast((period) => period.enabled)?.value ?? '';
    }

    return nextToSubmitPeriod?.value ?? '';
  }, [periods]);

  return (
    <Dialog>
      <Toaster />
      <DialogTrigger asChild>
        <Button size='sm' className='w-full md:w-fit'>
          Nueva Declaración
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva Declaración</DialogTitle>
          <DialogDescription>Elige el período a presentar.</DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            <Label>Año</Label>
            <Select value={year} onValueChange={handleYearChange}>
              <SelectTrigger>
                <SelectValue placeholder='Selecciona un año' />
              </SelectTrigger>
              <SelectContent>
                {Array.from(Array(10).keys()).map((yearNumber) => (
                  <SelectItem
                    key={yearNumber}
                    value={dayjs().subtract(yearNumber, 'year').format('YYYY')}
                  >
                    {dayjs().subtract(yearNumber, 'year').format('YYYY')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {isFetching && (
            <div className='flex flex-col gap-2'>
              <Label>Cargando períodos...</Label>
              <Skeleton className='h-10 w-full' />
            </div>
          )}
          {!isFetching && periods.length > 0 && (
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
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline'>Cancelar</Button>
          </DialogClose>
          <Link href={`/mis-declaraciones/nueva?period=${selectedPeriod}`}>
            <Button disabled={!selectedPeriod}>Seleccionar</Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
