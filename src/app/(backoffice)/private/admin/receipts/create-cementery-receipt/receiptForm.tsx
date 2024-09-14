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
import { cementery } from '@prisma/client';
import dayjs from 'dayjs';
import { useState } from 'react';

interface ReceiptFormProps {
  onSearch: (data: FormData) => Promise<cementery | null>;
  onSubmit: (data: FormData) => void;
}

export const ReceiptForm = ({ onSearch, onSubmit }: ReceiptFormProps) => {
  const [record, setRecord] = useState<cementery | null>(null);
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
            <CardTitle>Buscar registro de Cementerio</CardTitle>
            <CardDescription>
              Ingrese el nombre del contribuyente o del difunto para buscar el
              registro.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleSubmit} className='flex gap-3'>
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
  record: cementery | null;
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
            <CardTitle>Comprobante de Cementerio</CardTitle>
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
                  <Label>Apellido y nombre del contribuyente</Label>
                  <Input
                    type='text'
                    name='taxpayer'
                    value={record.taxpayer}
                    readOnly
                    className='cursor-not-allowed'
                  />
                </FormItem>
                <FormItem className='flex-none'>
                  <Label>Último año pagado</Label>
                  <Input
                    type='text'
                    name='last_year_paid'
                    value={Number(record.last_year_paid)}
                    readOnly
                    className='cursor-not-allowed'
                  />
                </FormItem>
              </div>

              <div className='w-full flex gap-3'>
                <FormItem className='flex-1'>
                  <Label>Dirección del contribuyente</Label>
                  <Input
                    type='text'
                    name='address_taxpayer'
                    value={record.address_taxpayer ?? ''}
                    readOnly
                    className='cursor-not-allowed'
                  />
                </FormItem>
                <FormItem className='flex-1'>
                  <Label>Barrio</Label>
                  <Input
                    type='text'
                    name='id_neighborhood'
                    value={'Centro'}
                    readOnly
                    className='cursor-not-allowed'
                  />
                </FormItem>
              </div>

              <div className='w-full flex gap-3'>
                <FormItem className='flex-1'>
                  <Label>Apellido y nombre del difunto</Label>
                  <Input
                    type='text'
                    name='deceased_name'
                    value={record.deceased_name ?? ''}
                    readOnly
                    className='cursor-not-allowed'
                  />
                </FormItem>
                <FormItem className='flex-1'>
                  <Label>Cementerio</Label>
                  <Input
                    type='text'
                    name='id_cementery_place'
                    value={'Municipal'}
                    readOnly
                    className='cursor-not-allowed'
                  />
                </FormItem>
              </div>

              <div className='w-full flex gap-3'>
                <FormItem className='flex-1'>
                  <Label>Tipo de entierro</Label>
                  <Input
                    type='text'
                    name='id_burial_type'
                    value={'Nicho'}
                    readOnly
                    className='cursor-not-allowed'
                  />
                </FormItem>
                <FormItem className='flex-1'>
                  <Label>Sección</Label>
                  <Input
                    type='text'
                    name='section'
                    value={record.section ?? ''}
                    readOnly
                    className='cursor-not-allowed'
                  />
                </FormItem>
                <FormItem className='flex-1'>
                  <Label>Fila</Label>
                  <Input
                    type='text'
                    name='row'
                    value={Number(record.row)}
                    readOnly
                    className='cursor-not-allowed'
                  />
                </FormItem>
                <FormItem className='flex-1'>
                  <Label>Número</Label>
                  <Input
                    type='text'
                    name='location_number'
                    value={Number(record.location_number)}
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
