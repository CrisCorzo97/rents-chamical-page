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
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import locale from 'dayjs/locale/es';
import utc from 'dayjs/plugin/utc';
import Link from 'next/link';
import { PeriodToSubmit } from '../types/affidavits.types';
dayjs.locale(locale);
dayjs.extend(utc);

export const CreateAffidavitButton = ({
  periods,
}: {
  periods: PeriodToSubmit[];
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);

  const defaultPeriod = useMemo(() => {
    const nextToSubmitPeriod = periods.find((period) => period.nextToSubmit);

    if (!nextToSubmitPeriod) {
      return periods.findLast((period) => period.enabled)?.value ?? '';
    }

    return nextToSubmitPeriod?.value ?? '';
  }, [periods]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size='sm' className='w-full md:w-fit'>
          Nueva Declaración
        </Button>
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
          <DialogClose asChild>
            <Button variant='outline'>Cancelar</Button>
          </DialogClose>
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
