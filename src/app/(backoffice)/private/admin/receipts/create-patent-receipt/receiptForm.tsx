'use client';

import { Button, Input, Label } from '@/components/ui';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FormItem } from '@/components/ui/form';
import { formatCurrency } from '@/lib/formatters';
import dayjs from 'dayjs';
import { useState } from 'react';

interface ReceiptFormProps {
  onSubmit: (data: FormData) => void;
}

export const ReceiptForm = ({ onSubmit }: ReceiptFormProps) => {
  const [amountValue, setAmountValue] = useState<string>('');

  return (
    <section>
      <Card className='mt-6 max-w-3xl'>
        <CardHeader>
          <CardTitle>Comprobante de Inmueble</CardTitle>
          <CardDescription>
            Revise que todos los datos del comprobante sean correctos antes de
            generar el comprobante.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={onSubmit} className='w-full flex flex-col gap-3'>
            <div className='w-full flex flex-wrap gap-3'>
              <FormItem className='flex-none'>
                <Label>Fecha del comprobante</Label>
                <Input
                  type='text'
                  name='created_at'
                  value={dayjs().format('DD/MM/YYYY')}
                  readOnly
                  className='cursor-not-allowed'
                />
              </FormItem>
              <FormItem className='flex-1'>
                <Label>Dominio</Label>
                <Input type='text' name='domain' placeholder='ABC 123' />
              </FormItem>
            </div>

            <div className='w-full flex flex-wrap gap-3'>
              <FormItem className='flex-1'>
                <Label>Apellido y nombre del contribuyente</Label>
                <Input type='text' name='taxpayer' placeholder='Juan Pérez' />
              </FormItem>
              <FormItem className='flex-1'>
                <Label>DNI</Label>
                <Input type='text' name='dni' placeholder='23.571.481' />
              </FormItem>
            </div>

            <div className='w-full flex flex-wrap gap-3'>
              <FormItem className='flex-1'>
                <Label>Vehículo</Label>
                <Input type='text' name='vehicle' placeholder='Gol' />
              </FormItem>
              <FormItem className='flex-1'>
                <Label>Marca</Label>
                <Input type='text' name='brand' placeholder='Volskwagen' />
              </FormItem>
              <FormItem className='flex-1'>
                <Label>Año pagado</Label>
                <Input type='text' name='year_to_pay' placeholder='2024' />
              </FormItem>
            </div>

            <div className='w-full flex gap-3'>
              <FormItem className='flex-1'>
                <Label>Observaciones</Label>
                <Input
                  type='text'
                  name='observations'
                  placeholder='Tenía saldo a favor...'
                />
              </FormItem>
              <FormItem className='flex-none'>
                <Label>Importe</Label>
                <Input
                  type='text'
                  name='amount'
                  placeholder='$ 1.000'
                  className='flex-1'
                  value={amountValue}
                  onChange={(e) =>
                    setAmountValue(formatCurrency(e.target.value))
                  }
                />
              </FormItem>
            </div>

            <div className='mt-6 flex gap-3 self-end'>
              <FormItem>
                <Button type='submit'>Crear comprobante</Button>
              </FormItem>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};
