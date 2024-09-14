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
import { property } from '@prisma/client';
import dayjs from 'dayjs';
import { useState } from 'react';

interface ReceiptFormProps {
  onSearch: (data: FormData) => Promise<property | null>;
  onSubmit: (data: FormData) => void;
}

export const ReceiptForm = ({ onSearch, onSubmit }: ReceiptFormProps) => {
  const [record, setRecord] = useState<property | null>(null);
  const [recordNotFound, setRecordNotFound] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const handleSubmit = (formData: FormData) => {
    setIsSearching(true);
    setTimeout(() => {
      onSearch(formData)
        .then((data) => {
          if (data) {
            setRecordNotFound(false);
            setRecord(data);
          } else {
            setRecordNotFound(true);
            setRecord(data);
          }
        })
        .finally(() => setIsSearching(false));
    }, 1500);
  };

  return (
    <>
      <section>
        <Card className='mt-6 max-w-3xl'>
          <CardHeader>
            <CardTitle>Buscar registro de Inmueble</CardTitle>
            <CardDescription>
              Ingrese la matrícula para buscar el registro.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleSubmit} className='flex gap-3'>
              <FormItem className='w-full'>
                <Label>Matrícula</Label>
                <Input
                  type='text'
                  name='enrollment'
                  placeholder='3771-836-1948'
                  required
                />
              </FormItem>

              <FormItem className='mt-3 self-end'>
                <Button
                  type='submit'
                  loading={isSearching}
                  className='flex gap-2 transition-all'
                >
                  Buscar
                </Button>
              </FormItem>
            </form>
          </CardContent>
        </Card>
      </section>

      <CardResult
        record={record}
        recordNotFound={recordNotFound}
        onSubmit={onSubmit}
      />
    </>
  );
};

interface CardResultProps {
  record: property | null;
  recordNotFound: boolean;
  onSubmit: (data: FormData) => void;
}

const CardResult = ({ record, recordNotFound, onSubmit }: CardResultProps) => {
  const [amountValue, setAmountValue] = useState<string>('');

  return (
    <section>
      {record ? (
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
                  <Label>Matrícula</Label>
                  <Input
                    type='text'
                    name='enrollment'
                    value={record.enrollment ?? ''}
                    readOnly
                    className='cursor-not-allowed'
                  />
                </FormItem>
                <FormItem className='flex-1'>
                  <Label>Es parte</Label>
                  <Input
                    type='text'
                    name='is_part'
                    value={record.is_part ? 'Sí' : 'No'}
                    readOnly
                    className='cursor-not-allowed'
                  />
                </FormItem>
              </div>

              <div className='w-full flex gap-3'>
                <FormItem className='flex-1'>
                  <Label>Apellido y nombre del contribuyente</Label>
                  <Input
                    type='text'
                    name='taxpayer'
                    value={record.taxpayer}
                    readOnly
                    className='cursor-not-allowed'
                  />
                </FormItem>
                <FormItem className='flex-1'>
                  <Label>Tipo de contribuyente</Label>
                  <Input
                    type='text'
                    name='taxpayer_type'
                    value={record.taxpayer_type ?? ''}
                    readOnly
                    className='cursor-not-allowed'
                  />
                </FormItem>
              </div>

              <div className='w-full flex gap-3'>
                <FormItem className='flex-1'>
                  <Label>Dirección</Label>
                  <Input
                    type='text'
                    name='address'
                    value={record.address ?? ''}
                    readOnly
                    className='cursor-not-allowed'
                  />
                </FormItem>
                <FormItem className='flex-none'>
                  <Label>Barrio</Label>
                  <Input
                    type='text'
                    name='id_neighborhood'
                    value={'Centro'}
                    readOnly
                    className='cursor-not-allowed'
                  />
                </FormItem>
                <FormItem className='flex-none'>
                  <Label>Sección</Label>
                  <Input
                    type='text'
                    name='id_city_section'
                    value={'A2'}
                    readOnly
                    className='cursor-not-allowed'
                  />
                </FormItem>
              </div>

              <div className='w-full flex gap-3'>
                <FormItem className='flex-1'>
                  <Label>Mts frente</Label>
                  <Input
                    type='text'
                    name='front_length'
                    value={record.front_length ?? ''}
                    readOnly
                    className='cursor-not-allowed'
                  />
                </FormItem>
                <FormItem className='flex-1'>
                  <Label>Último año pagado</Label>
                  <Input
                    type='text'
                    name='last_year_paid'
                    value={Number(record.last_year_paid) ?? ''}
                    readOnly
                    className='cursor-not-allowed'
                  />
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
                <FormItem className='flex-1'>
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
                  <Button variant='secondary'>Editar</Button>
                </FormItem>
                <FormItem>
                  <Button type='submit'>Crear comprobante</Button>
                </FormItem>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : recordNotFound ? (
        <Card className='mt-6 max-w-3xl'>
          <CardHeader>
            <CardTitle>Registro no encontrado</CardTitle>
            <CardDescription>
              No se encontró ningún registro con los datos ingresados.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p>
              Por favor, verifique los datos ingresados e intente nuevamente o
              cree un nuevo registro.
            </p>
          </CardContent>
        </Card>
      ) : (
        <></>
      )}
    </section>
  );
};
