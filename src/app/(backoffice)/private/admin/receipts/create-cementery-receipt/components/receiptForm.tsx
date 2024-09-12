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
import { cementery } from '@prisma/client';
import dayjs from 'dayjs';
import { useState } from 'react';

interface ReceiptFormProps {
  onSerach: (data: FormData) => Promise<cementery>;
  onSubmit: (data: FormData) => void;
}

export const ReceiptForm = ({ onSerach, onSubmit }: ReceiptFormProps) => {
  const [record, setRecord] = useState<cementery | null>(null);

  console.log({ record });

  return (
    <>
      <section>
        <Card className='mt-6 max-w-3xl'>
          <CardHeader>
            <CardTitle>Buscar registro de Cementerio</CardTitle>
            <CardDescription>
              Ingrese el nombre del contribuyente o del difunto para buscar el
              registro.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              action={(formData) => onSerach(formData).then(setRecord)}
              className='flex gap-3'
            >
              <FormItem className='w-full'>
                <Label>Apellido y Nombre</Label>
                <Input
                  type='text'
                  name='full_name'
                  placeholder='Mengano Fulano'
                  required
                />
              </FormItem>

              <FormItem className='mt-3 self-end'>
                <Button type='submit'>Buscar</Button>
              </FormItem>
            </form>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className='mt-6 max-w-3xl'>
          <CardHeader>
            <CardTitle>Comprobante de Cementerio</CardTitle>
            <CardDescription>
              Revise que todos los datos del comprobante sean correctos antes de
              generar el comprobante.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {record ? (
              <form action={onSubmit} className='w-full flex flex-col gap-3'>
                <div className='w-full flex gap-3'>
                  <FormItem className='flex-1'>
                    <Label>Fecha del comprobante</Label>
                    <Input
                      type='text'
                      name='created_at'
                      defaultValue={dayjs().format('DD/MM/YYYY')}
                      disabled
                    />
                  </FormItem>
                  <FormItem className='flex-1'>
                    <Label>Apellido y nombre del contribuyente</Label>
                    <Input
                      type='text'
                      name='taxpayer'
                      defaultValue={record.taxpayer}
                      disabled
                    />
                  </FormItem>
                </div>

                <div className='w-full flex gap-3'>
                  <FormItem className='flex-1'>
                    <Label>Apellido y nombre del difunto</Label>
                    <Input
                      type='text'
                      name='deceased_name'
                      defaultValue={record.deceased_name ?? ''}
                      disabled
                    />
                  </FormItem>
                  <FormItem className='flex-1'>
                    <Label>Tipo de entierro</Label>
                    <Input
                      type='text'
                      name='id_burial_type'
                      defaultValue={Number(record.id_burial_type)}
                      disabled
                    />
                  </FormItem>
                </div>

                <FormItem className='w-full'>
                  <Label>Fecha de Ingreso</Label>
                  <Input
                    type='date'
                    name='entry_date'
                    placeholder='2021-12-31'
                    required
                  />
                </FormItem>

                <FormItem className='w-full'>
                  <Label>Fecha de Egreso</Label>
                  <Input
                    type='date'
                    name='exit_date'
                    placeholder='2021-12-31'
                    required
                  />
                </FormItem>

                <FormItem className='w-full'>
                  <Label>Observaciones</Label>
                  <Input
                    type='text'
                    name='observations'
                    placeholder='Observaciones'
                  />
                </FormItem>

                <FormItem className='mt-3 self-end'>
                  <Button type='submit'>Generar</Button>
                </FormItem>
              </form>
            ) : (
              <p>No hay registros para mostrar.</p>
            )}
          </CardContent>
        </Card>
      </section>
    </>
  );
};
