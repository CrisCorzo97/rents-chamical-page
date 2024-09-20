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
import { formatCurrency, formatDni } from '@/lib/formatters';
import { PDFViewer } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { ReceiptPFD } from './receiptPFD';

dayjs.extend(customParseFormat);
dayjs.extend(utc);

const formSchema = z.object({
  created_at: z.date(),
  domain: z.string().min(6).max(7),
  taxpayer: z.string(),
  dni: z.string().min(10).max(10),
  vehicle: z.string(),
  brand: z.string(),
  year_to_pay: z.number(),
  observations: z.string(),
  amount: z.number(),
});

interface ReceiptFormProps {
  onSubmit: (data: FormData) => void;
}

export const ReceiptForm = ({ onSubmit }: ReceiptFormProps) => {
  const [amountValue, setAmountValue] = useState<string>('');
  const [dniValue, setDniValue] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const handleFormSubmit = (formData: FormData) => {
    const formDataObject = Object.fromEntries(formData.entries());
    const { created_at, ...rest } = formDataObject;

    const parsedDate = dayjs.utc().toISOString();
    console.log({ created_at, parsedDate });

    try {
      // Validar los datos usando el esquema de Zod
      formSchema.parse({
        ...rest,
        created_at: parsedDate,
        amount: Number(
          (formDataObject.amount as string).replace(/^[$,\.]/, '').trim()
        ),
        year_to_pay: Number(formDataObject.year_to_pay),
      });

      // Si es válido, puedes proceder con el submit
      console.log('Formulario válido', formDataObject);
    } catch (error) {
      console.log({ error });
      if (error instanceof z.ZodError) {
        // Capturar errores y mostrarlos en el formulario
        const newErrors: Record<string, string> = {};

        error.errors.forEach((err) => {
          const path = err.path.join('.');
          newErrors[path] = err.message;
        });

        setErrors(newErrors);
      }
    }
  };

  useEffect(() => {
    console.log({ errors });
  }, [errors]);

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
                <Input
                  type='text'
                  name='domain'
                  placeholder='AB123CD'
                  required
                />
              </FormItem>
            </div>

            <div className='w-full flex flex-wrap gap-3'>
              <FormItem className='flex-1'>
                <Label>Apellido y nombre del contribuyente</Label>
                <Input
                  type='text'
                  name='taxpayer'
                  placeholder='Juan Pérez'
                  required
                />
              </FormItem>
              <FormItem className='flex-1'>
                <Label>DNI</Label>
                <Input
                  type='text'
                  name='dni'
                  placeholder='23.571.481'
                  required
                  value={dniValue}
                  onChange={(e) => setDniValue(formatDni(e.target.value))}
                />
              </FormItem>
            </div>

            <div className='w-full flex flex-wrap gap-3'>
              <FormItem className='flex-1'>
                <Label>Vehículo</Label>
                <Input type='text' name='vehicle' placeholder='Gol' required />
              </FormItem>
              <FormItem className='flex-1'>
                <Label>Marca</Label>
                <Input
                  type='text'
                  name='brand'
                  placeholder='Volskwagen'
                  required
                />
              </FormItem>
              <FormItem className='flex-1'>
                <Label>Año pagado</Label>
                <Input
                  type='number'
                  max={dayjs().year()}
                  name='year_to_pay'
                  placeholder='2024'
                  required
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
              <FormItem className='flex-none'>
                <Label>Importe</Label>
                <Input
                  type='text'
                  name='amount'
                  placeholder='$ 1.000'
                  className='flex-1'
                  required
                  value={amountValue}
                  onChange={(e) =>
                    setAmountValue(formatCurrency(e.target.value))
                  }
                />
              </FormItem>
            </div>

            <div className='mt-6 flex gap-3 self-end'>
              <FormItem>
                <AlertDialog open={openDialog}>
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
