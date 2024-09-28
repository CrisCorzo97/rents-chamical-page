import { Button, Input, Label } from '@/components/ui';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
import { PDFViewer } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import { useState, useTransition } from 'react';
import { z } from 'zod';
import { ReceiptPFD } from './receiptPFD';

const formSchema = z.object({
  enrollment: z.string().optional(),
  taxpayer: z.string(),
  taxpayer_type: z.string().optional(),
  address: z.string(),
  front_length: z.string(),
  last_year_paid: z.number(),
  observations: z.string().optional(),
  amount: z.number(),
});

interface CementeryReceiptData {
  enrollment?: string;
  taxpayer: string;
  taxpayer_type?: string;
  address: string;
  front_length: string;
  last_year_paid: number;
  observations?: string;
  amount: number;
}

interface CardResultProps {
  record: cementery | null;
}

export const ReceiptForm = ({ record }: CardResultProps) => {
  const [amountValue, setAmountValue] = useState<string>('');
  const [isMutating, startMutatingTransition] = useTransition();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (formData: FormData) => {
    startMutatingTransition(async () => {});
  };

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
            <form action={handleSubmit} className='w-full flex flex-col gap-3'>
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
                <FormItem className='flex-none'>
                  <Label>Cementerio</Label>
                  <Input
                    type='text'
                    name='id_cementery_place'
                    value={'Municipal'}
                    readOnly
                    className='cursor-not-allowed'
                  />
                </FormItem>
                <FormItem className='flex-none'>
                  <Label>Tipo de entierro</Label>
                  <Input
                    type='text'
                    name='id_burial_type'
                    value={'Nicho'}
                    readOnly
                    className='cursor-not-allowed'
                  />
                </FormItem>
              </div>

              <div className='w-full flex gap-3'>
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
                <FormItem className='flex-1'>
                  <Label>Año a pagar</Label>
                  <Input
                    type='number'
                    name='year_to_pay'
                    min={dayjs().year()}
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
                  <AlertDialog open={openDialog}>
                    <AlertDialogTrigger asChild>
                      <Button
                        loading={isMutating}
                        type='submit'
                        className='hover:bg-opacity-50'
                      >
                        Generar comprobante
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className='flex flex-col min-h-[90vh] min-w-screen max-w-screen-2xl'>
                      <AlertDialogTitle>Comprobante generado</AlertDialogTitle>
                      <AlertDialogDescription>
                        El comprobante ha sido generado con éxito. Puede
                        descargarlo a continuación.
                      </AlertDialogDescription>
                      <PDFViewer className='flex-1 h-[95%] w-[95%] m-auto'>
                        <ReceiptPFD />
                      </PDFViewer>
                      <AlertDialogFooter className='flex-none'>
                        <AlertDialogAction onClick={() => setOpenDialog(false)}>
                          Continuar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </FormItem>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <></>
      )}
    </section>
  );
};
