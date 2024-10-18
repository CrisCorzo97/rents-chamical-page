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
import { formatCurrency, formatName } from '@/lib/formatters';
import { Prisma } from '@prisma/client';
import { PDFViewer } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { CementeryRecordWithRelations } from '../../../cementery/cementery.interface';
import { createReceipt } from '../../receipt-actions';
import { ReceiptPDF } from './receiptPDF';

const formSchema = z.object({
  created_at: z.string(),
  taxpayer: z.string(),
  address_taxpayer: z.string(),
  neighborhood: z.string(),
  deceased_name: z.string().optional(),
  cementery_place: z.string(),
  burial_type: z.string(),
  section: z.string().optional(),
  row: z.string().optional(),
  location_number: z.string().optional(),
  last_year_paid: z.number(),
  year_to_pay: z.number(),
  observations: z.string().optional(),
  amount: z.number(),
});

interface CementeryReceiptData {
  created_at: string;
  taxpayer: string;
  address_taxpayer: string;
  neighborhood: string;
  deceased_name?: string;
  cementery_place: string;
  burial_type: string;
  section?: string;
  row?: string;
  location_number?: string;
  last_year_paid: number;
  year_to_pay: number;
  observations?: string;
  amount: number;
}

interface CardResultProps {
  record: CementeryRecordWithRelations | null;
}

export const ReceiptForm = ({ record }: CardResultProps) => {
  const [amountValue, setAmountValue] = useState<string>('');
  const [isMutating, startMutatingTransition] = useTransition();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (formData: FormData) => {
    startMutatingTransition(async () => {
      const formDataObject = Object.fromEntries(formData.entries());

      const parsedDataObject: CementeryReceiptData = {
        created_at: dayjs().toISOString(),
        taxpayer: (formDataObject.taxpayer as string) ?? '',
        address_taxpayer: (formDataObject.address_taxpayer as string) ?? '',
        neighborhood: record?.neighborhood?.name ?? '',
        deceased_name: (formDataObject.deceased_name as string) ?? '',
        cementery_place: record?.cementery_place?.name ?? '',
        burial_type: record?.burial_type?.type ?? '',
        section: (formDataObject.section as string) ?? '',
        row: (formDataObject.row as string) ?? '',
        location_number: (formDataObject.location_number as string) ?? '',
        last_year_paid: Number(record?.last_year_paid),
        year_to_pay: Number(formDataObject.year_to_pay),
        observations: (formDataObject.observations as string) ?? '',
        amount: Number(
          (formDataObject.amount as string)
            .replace(/[.$]/g, '')
            .replace(',', '.')
            .trim()
        ),
      };

      try {
        formSchema.parse(parsedDataObject);

        try {
          const createData: Omit<Prisma.receiptCreateInput, 'id'> = {
            created_at: parsedDataObject.created_at,
            taxpayer: parsedDataObject.taxpayer.toUpperCase(),
            amount: parsedDataObject.amount,
            tax_type: 'CEMENTERIO',
            id_tax_reference: record?.id,
            other_data: {
              address_taxpayer: parsedDataObject.address_taxpayer,
              neighborhood: parsedDataObject.neighborhood,
              deceased_name: parsedDataObject.deceased_name?.toUpperCase(),
              cementery_place: parsedDataObject.cementery_place,
              burial_type: parsedDataObject.burial_type,
              section: parsedDataObject.section,
              row: parsedDataObject.row,
              location_number: parsedDataObject.location_number,
              last_year_paid: parsedDataObject.last_year_paid,
              year_to_pay: parsedDataObject.year_to_pay,
              observations: parsedDataObject.observations,
            },
          };

          await createReceipt({ data: createData });

          // Mostrar el diálogo de confirmación
          setOpenDialog(true);
        } catch (error) {
          toast.error(
            'Error al generar el comprobante de cementerio. Intente nuevamente.',
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
                    value={formatName(record.taxpayer)}
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
                    name='neighborhood'
                    value={record.neighborhood?.name ?? ''}
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
                    value={formatName(record.deceased_name ?? '')}
                    readOnly
                    className='cursor-not-allowed'
                  />
                </FormItem>
                <FormItem className='flex-none'>
                  <Label>Cementerio</Label>
                  <Input
                    type='text'
                    name='cementery_place'
                    value={record.cementery_place?.name ?? ''}
                    readOnly
                    className='cursor-not-allowed'
                  />
                </FormItem>
                <FormItem className='flex-none'>
                  <Label>Tipo de entierro</Label>
                  <Input
                    type='text'
                    name='burial_type'
                    value={record.burial_type?.type ?? ''}
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
                    max={dayjs().year()}
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
                  <Link href={`/private/admin/cementery/edit/${record.id}`}>
                    <Button variant='outline'>Editar</Button>
                  </Link>
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
                        <ReceiptPDF />
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
