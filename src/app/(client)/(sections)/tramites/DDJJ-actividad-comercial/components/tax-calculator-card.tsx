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
  isBothCategories: boolean;
}

export function TaxCalculatorCard({
  period,
  isBothCategories,
}: TaxCalculatorCardProps) {
  const [amount, setAmount] = useState<string>('');
  const [commerceAmount, setCommerceAmount] = useState<string>('');
  const [financialAmount, setFinancialAmount] = useState<string>('');
  const [calculatedAmount, setCalculatedAmount] = useState<number | null>(null);
  const [commerceCalculatedAmount, setCommerceCalculatedAmount] = useState<
    number | null
  >(null);
  const [financialCalculatedAmount, setFinancialCalculatedAmount] = useState<
    number | null
  >(null);
  const [isCalculating, startCalculateTransition] = useTransition();
  const [isCalculatingCommerce, startCalculateCommerceTransition] =
    useTransition();
  const [isCalculatingFinancial, startCalculateFinancialTransition] =
    useTransition();
  const [isMutating, startTransition] = useTransition();

  const { replace } = useRouter();

  const handleCalculate = () => {
    startCalculateTransition(async () => {
      const value = Number(
        amount.replace(/[.$]/g, '').replace(',', '.').trim()
      );

      const calculatedAmount = await calculateFeeAmount({
        amount: value,
      });

      setCalculatedAmount(calculatedAmount);
    });
  };

  const handleCalculateCommerce = () => {
    startCalculateCommerceTransition(async () => {
      const amount = Number(
        commerceAmount.replace(/[.$]/g, '').replace(',', '.').trim()
      );

      // Calculamos para categoría de Comercios
      const calculatedAmount = await calculateFeeAmount({
        amount,
        category: 'Comercios-Servicios-Industrias',
      });

      setCommerceCalculatedAmount(calculatedAmount);
    });
  };

  const handleCalculateFinancial = () => {
    startCalculateFinancialTransition(async () => {
      const amount = Number(
        financialAmount.replace(/[.$]/g, '').replace(',', '.').trim()
      );

      // Calculamos para categoría financiera
      const calculatedAmount = await calculateFeeAmount({
        amount,
        category: 'Bancos-Entidades Financieras-Compañías Financieras',
      });

      setFinancialCalculatedAmount(calculatedAmount);
    });
  };

  // Calculate total amount
  const totalCalculatedAmount = isBothCategories
    ? (commerceCalculatedAmount ?? 0) + (financialCalculatedAmount ?? 0)
    : calculatedAmount ?? 0;

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      let declared_amount = 0;
      let fee_amount = 0;

      if (isBothCategories) {
        // Suma ambas bases imponibles
        const commerce_amount = Number(
          (formData.get('commerce_amount') as string)
            .replace(/[.$]/g, '')
            .replace(',', '.')
            .trim()
        );

        const financial_amount = Number(
          (formData.get('financial_amount') as string)
            .replace(/[.$]/g, '')
            .replace(',', '.')
            .trim()
        );

        declared_amount = commerce_amount + financial_amount;

        // Suma ambas tasas calculadas
        const commerce_fee = Number(
          (formData.get('commerce_calculated_amount') as string)
            .replace(/[.$]/g, '')
            .replace(',', '.')
            .trim()
        );

        const financial_fee = Number(
          (formData.get('financial_calculated_amount') as string)
            .replace(/[.$]/g, '')
            .replace(',', '.')
            .trim()
        );

        fee_amount = commerce_fee + financial_fee;
      } else {
        declared_amount = Number(
          (formData.get('declared_amount') as string)
            .replace(/[.$]/g, '')
            .replace(',', '.')
            .trim()
        );

        fee_amount = totalCalculatedAmount;
      }

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
            {isBothCategories
              ? 'Ingresa las bases imponibles para calcular la tasa determinada'
              : 'Ingresa la base imponible para calcular la tasa determinada'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className='grid grid-cols-5 space-y-5'>
            {isBothCategories ? (
              <>
                <div className='col-span-5 grid grid-cols-5 gap-4'>
                  <FormItem className='space-y-2'>
                    <Label>Período</Label>
                    <Input
                      value={formatName(dayjs(period).format('MMMM YYYY'))}
                      readOnly
                    />
                  </FormItem>
                </div>

                <div className='col-span-5 grid grid-cols-5 gap-4'>
                  <FormItem className='col-span-5 space-y-2'>
                    <Label className='font-bold'>
                      Categoría: Comercios-Servicios-Industrias
                    </Label>
                  </FormItem>
                  <FormItem className='space-y-2'>
                    <Label>Base Imponible</Label>
                    <Input
                      name='commerce_amount'
                      type='string'
                      value={commerceAmount}
                      onChange={(e) =>
                        setCommerceAmount(formatCurrency(e.target.value))
                      }
                      placeholder='Ingrese el monto'
                    />
                  </FormItem>
                  <FormItem className='space-y-2'>
                    <Label>Tasa Determinada</Label>
                    <Input
                      name='commerce_calculated_amount'
                      className='bg-blue-100'
                      value={formatNumberToCurrency(
                        commerceCalculatedAmount ?? 0
                      )}
                      readOnly
                    />
                  </FormItem>
                  <FormItem className='space-y-2 flex items-end'>
                    <Button
                      onClick={handleCalculateCommerce}
                      loading={isCalculatingCommerce}
                      className='w-full mb-0'
                      type='button'
                    >
                      Calcular
                    </Button>
                  </FormItem>
                </div>

                <div className='col-span-5 grid grid-cols-5 gap-4'>
                  <FormItem className='col-span-5 space-y-2'>
                    <Label className='font-bold'>
                      Categoría: Bancos-Entidades Financieras-Compañías
                      Financieras
                    </Label>
                  </FormItem>
                  <FormItem className='space-y-2'>
                    <Label>Base Imponible</Label>
                    <Input
                      name='financial_amount'
                      type='string'
                      value={financialAmount}
                      onChange={(e) =>
                        setFinancialAmount(formatCurrency(e.target.value))
                      }
                      placeholder='Ingrese el monto'
                    />
                  </FormItem>
                  <FormItem className='space-y-2'>
                    <Label>Tasa Determinada</Label>
                    <Input
                      name='financial_calculated_amount'
                      className='bg-blue-100'
                      value={formatNumberToCurrency(
                        financialCalculatedAmount ?? 0
                      )}
                      readOnly
                    />
                  </FormItem>
                  <FormItem className='space-y-2 flex items-end'>
                    <Button
                      onClick={handleCalculateFinancial}
                      loading={isCalculatingFinancial}
                      className='w-full mb-0'
                      type='button'
                    >
                      Calcular
                    </Button>
                  </FormItem>
                </div>
              </>
            ) : (
              // Formulario original para un solo tipo
              <div className='col-span-5 grid grid-cols-5 gap-4'>
                <FormItem className='space-y-2'>
                  <Label>Período</Label>
                  <Input value={formatName(period)} readOnly />
                </FormItem>
                <FormItem className='space-y-2'>
                  <Label>Base Imponible</Label>
                  <Input
                    name='declared_amount'
                    type='string'
                    value={amount}
                    onChange={(e) => setAmount(formatCurrency(e.target.value))}
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
                    type='button'
                  >
                    Calcular
                  </Button>
                </FormItem>
              </div>
            )}

            {/* Display Total Amount */}
            {(commerceCalculatedAmount !== null ||
              (isBothCategories && financialCalculatedAmount !== null)) && (
              <div className='col-span-5 mt-4 pt-4 border-t'>
                <div className='flex justify-end items-center gap-4'>
                  <Label className='text-lg font-semibold'>
                    Tasa Determinada Total:
                  </Label>
                  <Input
                    name='total_calculated_amount'
                    className='bg-green-100 text-lg font-bold w-auto text-right'
                    value={formatNumberToCurrency(totalCalculatedAmount)}
                    readOnly
                  />
                </div>
              </div>
            )}

            <Button
              type='submit'
              size='lg'
              className='col-start-5'
              loading={isMutating}
              disabled={
                isBothCategories
                  ? commerceCalculatedAmount === null ||
                    financialCalculatedAmount === null
                  : calculatedAmount === null
              }
            >
              Presentar
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
