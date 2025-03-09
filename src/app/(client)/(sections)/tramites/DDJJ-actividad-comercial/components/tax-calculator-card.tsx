'use client';

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  FormItem,
  Input,
  Label,
} from '@/components/ui';
import { useState, useTransition } from 'react';
import {
  formatCurrency,
  formatName,
  formatNumberToCurrency,
} from '@/lib/formatters';
import { calculateFeeAmount, createAffidavit } from '../affidavit.actions';
import { toast, Toaster } from 'sonner';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import locale from 'dayjs/locale/es';
dayjs.locale(locale);

interface TaxCalculatorCardProps {
  period: string;
}

export function TaxCalculatorCard({ period }: TaxCalculatorCardProps) {
  const [declaredAmount, setDeclaredAmount] = useState<string>('');
  const [calculatedAmount, setCalculatedAmount] = useState<number | null>(null);
  const [isCalculating, startCalculateTransition] = useTransition();
  const [isMutating, startTransition] = useTransition();

  const { replace } = useRouter();

  const handleCalculate = () => {
    startCalculateTransition(async () => {
      const declared_amount = Number(
        declaredAmount.replace(/[.$]/g, '').replace(',', '.').trim()
      );
      const calculated_amount = await calculateFeeAmount({
        amount: declared_amount,
      });

      setCalculatedAmount(calculated_amount);
    });
  };

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const declared_amount = Number(
        (formData.get('declared_amount') as string)
          .replace(/[.$]/g, '')
          .replace(',', '.')
          .trim()
      );

      const fee_amount = Number(
        (formData.get('calculated_amount') as string)
          .replace(/[.$]/g, '')
          .replace(',', '.')
          .trim()
      );

      try {
        const { data, error } = await createAffidavit({
          period,
          declared_amount,
          fee_amount,
        });

        if (error) {
          toast.error(error, { duration: 5000 });
          console.log({ error });
        }

        if (data) {
          toast.success('Declaración jurada creada con éxito.', {
            duration: 5000,
          });

          replace(`/tramites/DDJJ-actividad-comercial`);
        }
      } catch (error) {
        toast.error(
          'Error al crear la declaración jurada. Intente nuevamente.',
          { duration: 5000 }
        );
        console.log({ error });
      }
    });
  };

  return (
    <>
      <Toaster />
      <Card className='w-full'>
        <CardHeader>
          <CardTitle className='text-lg font-medium'>
            Ingresa la base imponible para calcular la tasa determinada
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className='grid grid-cols-5 space-y-5'>
            <div className='col-span-5 grid grid-cols-5 gap-4'>
              <FormItem className='space-y-2'>
                <Label>Período</Label>
                <Input
                  value={formatName(dayjs(period).format('MMMM YYYY'))}
                  readOnly
                />
              </FormItem>
              <FormItem className='space-y-2'>
                <Label>Base Imponible</Label>
                <Input
                  name='declared_amount'
                  type='string'
                  value={declaredAmount}
                  onChange={(e) =>
                    setDeclaredAmount(formatCurrency(e.target.value))
                  }
                  placeholder='Ingrese el monto'
                />
              </FormItem>
              <FormItem className='space-y-2'>
                <Label>Tasa Determinada</Label>
                <Input
                  name='calculated_amount'
                  className='bg-blue-100'
                  value={formatNumberToCurrency(calculatedAmount ?? 0)}
                  readOnly
                />
              </FormItem>
              <FormItem className='space-y-2 flex items-end'>
                <Button
                  onClick={handleCalculate}
                  loading={isCalculating}
                  className='w-full mb-0'
                >
                  Calcular
                </Button>
              </FormItem>
            </div>

            <Button
              type='submit'
              size='lg'
              className='col-start-5'
              loading={isMutating}
              disabled={calculatedAmount === null}
            >
              Presentar
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
