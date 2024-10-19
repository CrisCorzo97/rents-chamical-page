'use client';

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
import { Toaster } from '@/components/ui/sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatCurrency, formatDni } from '@/lib/formatters';
import { Prisma } from '@prisma/client';
import { PDFViewer } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Info } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { createReceipt } from '../receipt-actions';
import { PatentReceiptData } from './page';
import { ReceiptPDF, ReceiptPDFProps } from './receiptPDF';

dayjs.extend(customParseFormat);

const formSchema = z.object({
  created_at: z.string().datetime(),
  domain: z
    .string()
    .min(6, { message: 'Debe contener al menos 6 caracteres.' })
    .max(7, { message: 'Debe contener como máximo 7 caracteres.' }),
  taxpayer: z.string(),
  dni: z
    .string()
    .min(9, { message: 'Debe contener al menos 9 caracteres.' })
    .max(10, { message: 'Debe contener como máximo 10 caracteres.' }),
  vehicle: z.string(),
  brand: z.string(),
  year_to_pay: z.number(),
  observations: z.string().optional(),
  amount: z.number(),
});

export const ReceiptForm = () => {
  const [amountValue, setAmountValue] = useState<string>('');
  const [dniValue, setDniValue] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [contentDialog, setContentDialog] = useState<ReceiptPDFProps['data']>({
    receiptId: '',
    domain: '',
    owner: '',
    dni: '',
    vehicle: '',
    brand: '',
    year_to_pay: 0,
    observations: '',
    amount: 0,
  });
  const [isPending, startTransition] = useTransition();

  const handleFormSubmit = (formData: FormData) => {
    startTransition(async () => {
      const formDataObject = Object.fromEntries(formData.entries());

      const parsedDataObject: PatentReceiptData = {
        domain: formDataObject.domain as string,
        taxpayer: formDataObject.taxpayer as string,
        dni: formDataObject.dni as string,
        vehicle: formDataObject.vehicle as string,
        brand: formDataObject.brand as string,
        created_at: dayjs().toISOString(),
        amount: Number(
          (formDataObject.amount as string)
            .replace(/[.$]/g, '')
            .replace(',', '.')
            .trim()
        ),
        year_to_pay: Number(formDataObject.year_to_pay),
      };

      try {
        // Validar los datos usando el esquema de Zod
        formSchema.parse(parsedDataObject);

        try {
          const createData: Omit<Prisma.receiptCreateInput, 'id'> = {
            created_at: parsedDataObject.created_at,
            taxpayer: parsedDataObject.taxpayer.toUpperCase(),
            amount: parsedDataObject.amount,
            tax_type: 'PATENTE',
            other_data: {
              domain: parsedDataObject.domain,
              dni: parsedDataObject.dni,
              vehicle: parsedDataObject.vehicle,
              brand: parsedDataObject.brand,
              year_to_pay: parsedDataObject.year_to_pay,
              observations: parsedDataObject.observations,
            },
          };

          const { success, data, error } = await createReceipt({
            data: createData,
          });

          if (!success || !data) {
            throw new Error(error ?? '');
          }

          // Actualizar el contenido del diálogo
          setContentDialog({
            receiptId: data.id,
            domain: parsedDataObject.domain,
            owner: parsedDataObject.taxpayer,
            dni: parsedDataObject.dni,
            vehicle: parsedDataObject.vehicle,
            brand: parsedDataObject.brand,
            year_to_pay: parsedDataObject.year_to_pay,
            observations: parsedDataObject.observations ?? '',
            amount: parsedDataObject.amount,
          });

          // Mostrar el diálogo de confirmación
          setOpenDialog(true);
        } catch (error) {
          toast.error(
            'Error al generar el comprobante de patente. Intente nuevamente.',
            { duration: 5000 }
          );
          console.log({ error });
        }
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
    });
  };

  return (
    <section>
      <Toaster />
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
                  required
                  className={errors.domain ? 'border-red-500' : ''}
                />
                {errors.domain && (
                  <span className='text-red-500 text-xs'>{errors.domain}</span>
                )}
              </FormItem>
            </div>

            <div className='w-full flex flex-wrap gap-3'>
              <FormItem className='flex-1'>
                <Label>Apellido y nombre del contribuyente</Label>
                <Input type='text' name='taxpayer' required />
              </FormItem>
              <FormItem className='flex-1 '>
                <Label className='inline-flex'>
                  DNI
                  <TooltipProvider>
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger asChild>
                        <Info
                          size={14}
                          className='text-cyan-600 ml-1 cursor-pointer'
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Escribir el númerio de DNI sin puntos</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Input
                  type='text'
                  name='dni'
                  required
                  value={dniValue}
                  onChange={(e) => setDniValue(formatDni(e.target.value))}
                  className={errors.dni ? 'border-red-500' : ''}
                />
                {errors.dni && (
                  <span className='text-red-500 text-xs'>{errors.dni}</span>
                )}
              </FormItem>
            </div>

            <div className='w-full flex flex-wrap gap-3'>
              <FormItem className='flex-1'>
                <Label>Vehículo</Label>
                <Input type='text' name='vehicle' required />
              </FormItem>
              <FormItem className='flex-1'>
                <Label>Marca</Label>
                <Input type='text' name='brand' required />
              </FormItem>
              <FormItem className='flex-1'>
                <Label>Año pagado</Label>
                <Input
                  type='number'
                  max={dayjs().year()}
                  name='year_to_pay'
                  required
                />
              </FormItem>
            </div>

            <div className='w-full flex gap-3'>
              <FormItem className='flex-1'>
                <Label>Observaciones</Label>
                <Input type='text' name='observations' maxLength={60} />
              </FormItem>
              <FormItem className='flex-none'>
                <Label>Importe</Label>
                <Input
                  type='text'
                  name='amount'
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
                    <Button
                      type='submit'
                      className='hover:bg-opacity-50'
                      loading={isPending}
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
                      <ReceiptPDF data={contentDialog} />
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
    </section>
  );
};
