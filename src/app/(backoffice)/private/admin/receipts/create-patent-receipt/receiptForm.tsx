'use client';

import { Button, Input, Label } from '@/components/ui';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
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
import { PDFViewer } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import { useState } from 'react';
import { ReceiptPFD } from './receiptPFD';

interface ReceiptFormProps {
  onSubmit: (data: FormData) => void;
}

export const ReceiptForm = ({ onSubmit }: ReceiptFormProps) => {
  const [amountValue, setAmountValue] = useState<string>('');
  const [openPDFView, setOpenPDFView] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData | null>(null);

  const handleFormSubmit = (formData: FormData) => {
    setFormData(formData);
    setOpenPDFView(true);
  };

  return (
    <section>
      <Card className='mt-6 max-w-3xl'>
        <CardHeader>
          <CardTitle>Comprobante de Patente</CardTitle>
          <CardDescription>
            Revise que todos los datos del comprobante sean correctos antes de
            generar el comprobante.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={handleFormSubmit}
            className='w-full flex flex-col gap-3'
          >
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
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button type='submit' className='hover:bg-opacity-50'>
                      Generar comprobante
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className='flex flex-col min-h-[90vh] min-w-screen max-w-screen-2xl'>
                    <PDFViewer className='flex-1 h-[95%] w-[95%] m-auto'>
                      <ReceiptPFD />
                    </PDFViewer>
                    <AlertDialogFooter className='flex-none'>
                      <AlertDialogAction>Continuar</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </FormItem>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};
