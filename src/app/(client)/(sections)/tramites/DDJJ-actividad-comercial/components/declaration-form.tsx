'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Declaration } from '../types';
import { formatCurrency } from '@/lib/formatters';

dayjs.locale('es');
dayjs.extend(customParseFormat);

const formSchema = z.object({
  period: z.string().min(1, 'El período es obligatorio'),
  grossAmount: z.string().min(1, 'El importe bruto es obligatorio'),
});

interface DeclarationFormProps {
  onSubmit: (declaration: Declaration) => void;
  onCancel: () => void;
}

export default function DeclarationForm({
  onSubmit,
  onCancel,
}: DeclarationFormProps) {
  const [step, setStep] = useState(1);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      period: '',
      grossAmount: '0',
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (step === 1) {
      setStep(2);
    } else {
      const declaration: Declaration = {
        id: `new-${values.period}`,
        period: values.period,
        grossAmount: Number(
          values.grossAmount.toString().replace('.', '').replace('$', '')
        ),
        status: 'payment_pending',
        dueDate: dayjs().startOf('month').add(19, 'day').format('YYYY-MM-DD'),
      };
      onSubmit(declaration);
    }
  };

  const getPeriods = () => {
    const periods = [];
    const currentDate = dayjs().subtract(1, 'month'); // Start from the previous month
    for (let i = 0; i < 12; i++) {
      // Go back 12 months
      const date = currentDate.subtract(i, 'month');
      periods.push({
        value: date.format('YYYY-MM'),
        label: date.format('MMMM YYYY'),
      });
    }
    return periods;
  };

  return (
    <Card className='max-w-2xl mx-auto'>
      <CardHeader>
        <CardTitle>
          {step === 1
            ? 'Nueva Declaración Jurada'
            : 'Resumen de la Declaración'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-6'
          >
            {step === 1 ? (
              <>
                <FormField
                  control={form.control}
                  name='period'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Período a declarar</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Seleccionar período' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {getPeriods().map((period) => (
                            <SelectItem key={period.value} value={period.value}>
                              {period.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='grossAmount'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Importe Bruto</FormLabel>
                      <FormControl>
                        <Input
                          type='text'
                          placeholder='Ingresar monto'
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(
                              formatCurrency(
                                e.target.value.replace(/[^0-9.]/g, '')
                              )
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ) : (
              <div className='space-y-4'>
                <div className='grid grid-cols-2 gap-4 text-sm'>
                  <div className='font-medium'>Período:</div>
                  <div>{dayjs(form.getValues('period')).format('MM/YYYY')}</div>
                  <div className='font-medium'>Fecha de la presentación:</div>
                  <div>{dayjs().format('DD/MM/YYYY')}</div>
                  <div className='font-medium'>Ingresos Brutos declarado:</div>
                  <div>{form.getValues('grossAmount')}</div>
                  <hr className='col-span-2' />
                  <div className='font-medium'>Importe a pagar (10%):</div>
                  <div className='font-semibold'>
                    {formatCurrency(
                      `${
                        Number(
                          form
                            .getValues('grossAmount')
                            .toString()
                            .replace(/[^0-9]/g, '')
                        ) * 0.1
                      }`
                    )}
                  </div>
                </div>
              </div>
            )}
            <div className='flex justify-end space-x-4'>
              <Button type='button' variant='outline' onClick={onCancel}>
                Cancelar
              </Button>
              <Button type='submit'>
                {step === 1 ? 'Continuar' : 'Confirmar'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
