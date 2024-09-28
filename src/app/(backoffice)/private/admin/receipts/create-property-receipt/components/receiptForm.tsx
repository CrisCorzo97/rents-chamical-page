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
import { formatCurrency } from '@/lib/formatters';
import { Prisma, property } from '@prisma/client';
import { PDFViewer } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { updateProperty } from '../../../property/actions.property';
import { createReceipt } from '../../receipt-actions';
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

interface PropertyReceiptData {
  created_at: string;
  enrollment?: string;
  taxpayer: string;
  taxpayer_type?: string;
  address: string;
  front_length: string;
  last_year_paid: number;
  observations?: string;
  amount: number;
  year_to_pay: number;
}

interface ReceiptFormProps {
  record: property | null;
}

export const ReceiptForm = ({ record }: ReceiptFormProps) => {
  const [amountValue, setAmountValue] = useState<string>('');
  const [isMutating, startMutatingTransition] = useTransition();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (formData: FormData) => {
    startMutatingTransition(async () => {
      const formDataObject = Object.fromEntries(formData.entries());

      const parsedDataObject: PropertyReceiptData = {
        created_at: dayjs().toISOString(),
        enrollment: formDataObject.enrollment as string,
        taxpayer: formDataObject.taxpayer as string,
        taxpayer_type: formDataObject.taxpayer
          ? (formDataObject.taxpayer as string)
          : undefined,
        address: formDataObject.address as string,
        front_length: formDataObject.front_length as string,
        last_year_paid: Number(formDataObject.last_year_paid as string),
        observations: formDataObject.observations
          ? (formDataObject.observations as string)
          : undefined,
        amount: Number(
          (formDataObject.amount as string)
            .replace(/[.$]/g, '')
            .replace(',', '.')
            .trim()
        ),
        year_to_pay: Number(formDataObject.year_to_pay as string),
      };

      try {
        formSchema.parse(parsedDataObject);

        try {
          await updateProperty({
            where: { id: record?.id },
            data: { last_year_paid: parsedDataObject.year_to_pay },
          });

          const createData: Prisma.receiptCreateInput = {
            id: crypto.randomUUID(),
            created_at: parsedDataObject.created_at,
            taxpayer: parsedDataObject.taxpayer,
            amount: parsedDataObject.amount,
            tax_type: 'INMUEBLE',
            id_tax_reference: record?.id,
            other_data: {
              enrollment: parsedDataObject.enrollment,
              taxpayer_type: parsedDataObject.taxpayer_type,
              address: parsedDataObject.address,
              front_length: parsedDataObject.front_length,
              last_year_paid: parsedDataObject.last_year_paid,
              observations: parsedDataObject.observations,
              year_to_pay: parsedDataObject.year_to_pay,
            },
          };

          await createReceipt({ data: createData });

          // Mostrar el diálogo de confirmación
          setOpenDialog(true);
        } catch (error) {
          toast.error(
            'Error al generar el comprobante de inmueble. Intente nuevamente.',
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
                <FormItem className='flex-1'>
                  <Label>Año a pagar</Label>
                  <Input
                    type='number'
                    name='year_to_pay'
                    max={dayjs().year()}
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
                  <Button
                    // Agregar redirección a la página de edición de registro
                    variant='secondary'
                  >
                    Editar
                  </Button>
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
