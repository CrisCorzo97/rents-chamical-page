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
import { CommercialEnablementWithRelations } from '../../../commercial_enablement/commercial_enablement.interface';
import { createReceipt } from '../../receipt-actions';
import { ReceiptPDF, ReceiptPDFProps } from './receiptPDF';

const formSchema = z.object({
  created_at: z.string(),
  tax_id: z.string(),
  taxpayer: z.string(),
  company_name: z.string(),
  commercial_activity: z.string(),
  address: z.string(),
  address_number: z.number().nullable(),
  neighborhood: z.string(),
  city_section: z.string(),
  block: z.nullable(z.string()),
  parcel: z.nullable(z.string()),
  registration_date: z.string(),
  cancellation_date: z.nullable(z.string().datetime()),
  registration_receipt: z.string(),
  cancellation_receipt: z.nullable(z.string()),
  gross_income_rate: z.nullable(z.string()),
  last_year_paid: z.nullable(z.number()),
  year_to_pay: z.number(),
  observations: z.string(),
  amount: z.number(),
});

interface CommercialEnablementReceiptData {
  created_at: string;
  tax_id: string;
  taxpayer: string;
  company_name: string;
  commercial_activity: string;
  address: string;
  address_number: number | null;
  neighborhood: string;
  city_section: string;
  block: string | null;
  parcel: string | null;
  registration_date: string;
  cancellation_date: string | null;
  registration_receipt: string;
  cancellation_receipt: string | null;
  gross_income_rate: string | null;
  last_year_paid: number | null;
  year_to_pay: number;
  observations: string;
  amount: number;
}

interface CardResultProps {
  record: CommercialEnablementWithRelations | null;
}

export const ReceiptForm = ({ record }: CardResultProps) => {
  const [amountValue, setAmountValue] = useState<string>('');
  const [isMutating, startMutatingTransition] = useTransition();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [contentDialog, setContentDialog] = useState<ReceiptPDFProps['data']>({
    receiptId: '',
    taxpayer: '',
    address: '',
    neighborhood: '',
    yearToPay: 0,
    observations: '',
    amount: 0,
  });

  const handleSubmit = (formData: FormData) => {
    startMutatingTransition(async () => {
      const formDataObject = Object.fromEntries(formData.entries());

      const parsedDataObject: CommercialEnablementReceiptData = {
        created_at: dayjs().toISOString(),
        tax_id: (formDataObject?.tax_id as string) ?? '',
        taxpayer: (formDataObject?.taxpayer as string) ?? '',
        company_name: (formDataObject?.company_name as string) ?? '',
        commercial_activity:
          (formDataObject?.commercial_activity as string) ?? '',
        address: (formDataObject?.address as string) ?? '',
        address_number: Number(formDataObject?.address_number),
        neighborhood: (formDataObject?.neighborhood as string) ?? '',
        city_section: (formDataObject?.city_section as string) ?? '',
        block: (formDataObject?.block as string) ?? '',
        parcel: (formDataObject?.parcel as string) ?? '',
        registration_date: formDataObject?.registration_date
          ? dayjs(formDataObject.registration_date as string).toISOString()
          : '',
        cancellation_date: formDataObject?.cancellation_date
          ? dayjs(formDataObject.cancellation_date as string).toISOString()
          : null,
        registration_receipt:
          (formDataObject?.registration_receipt as string) ?? '',
        cancellation_receipt:
          (formDataObject?.cancellation_receipt as string) ?? null,
        gross_income_rate: formDataObject?.gross_income_rate
          ? (formDataObject.gross_income_rate as string)
          : null,
        last_year_paid: formDataObject?.last_year_paid
          ? Number(formDataObject?.last_year_paid)
          : null,
        year_to_pay: Number(formDataObject.year_to_pay),
        observations: (formDataObject?.observations as string) ?? '',
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
            tax_type: 'HABILITACIÓN COMERCIAL',
            id_tax_reference: record?.id,
            other_data: {
              company_name: parsedDataObject.company_name.toUpperCase(),
              commercial_activity:
                parsedDataObject.commercial_activity.toUpperCase(),
              address: parsedDataObject.address.toUpperCase(),
              address_number: parsedDataObject.address_number,
              neighborhood: parsedDataObject.neighborhood.toUpperCase(),
              city_section: parsedDataObject.city_section.toUpperCase(),
              block: parsedDataObject.block?.toUpperCase(),
              parcel: parsedDataObject.parcel?.toUpperCase(),
              registration_date: parsedDataObject.registration_date,
              cancellation_date: parsedDataObject.cancellation_date,
              registration_receipt: parsedDataObject.registration_receipt,
              cancellation_receipt: parsedDataObject.cancellation_receipt,
              gross_income_rate: parsedDataObject.gross_income_rate,
              last_year_paid: parsedDataObject.last_year_paid,
              year_to_pay: parsedDataObject.year_to_pay,
              observations: parsedDataObject.observations.toUpperCase(),
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
            taxpayer: parsedDataObject.taxpayer,
            address: parsedDataObject.address,
            neighborhood: record?.neighborhood?.name ?? '',
            yearToPay: parsedDataObject.year_to_pay,
            observations: parsedDataObject.observations ?? '',
            amount: parsedDataObject.amount,
          });

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
      }
    });
  };

  return (
    <section>
      <Toaster />
      {record ? (
        <Card className='mt-6 max-w-3xl'>
          <CardHeader>
            <CardTitle>Comprobante de habilitación comercial</CardTitle>
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
                  <Label>CUIT / CUIL</Label>
                  <Input
                    type='text'
                    name='tax_id'
                    value={formatName(record?.tax_id ?? '')}
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
                  <Label>Apellido y nombre del contribuyente</Label>
                  <Input
                    type='text'
                    name='taxpayer'
                    value={record?.taxpayer ?? ''}
                    readOnly
                    className='cursor-not-allowed'
                  />
                </FormItem>
                <FormItem className='flex-1'>
                  <Label>Razón social</Label>
                  <Input
                    type='text'
                    name='company_name'
                    value={record.company_name ?? ''}
                    readOnly
                    className='cursor-not-allowed'
                  />
                </FormItem>
              </div>

              <div className='w-full flex gap-3'>
                <FormItem className='flex-1'>
                  <Label>Rubro</Label>
                  <Input
                    type='text'
                    name='commercial_activity'
                    value={record.commercial_activity?.activity ?? ''}
                    readOnly
                    className='cursor-not-allowed'
                  />
                </FormItem>
                <FormItem className='flex-1'>
                  <Label>Dirección del contribuyente</Label>
                  <Input
                    type='text'
                    name='address'
                    value={record?.address ?? ''}
                    readOnly
                    className='cursor-not-allowed'
                  />
                </FormItem>
                <FormItem className='flex-1'>
                  <Label>Nro</Label>
                  <Input
                    type='number'
                    name='address_number'
                    value={
                      record.address_number
                        ? Number(record.address_number)
                        : undefined
                    }
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
                  <Label>Sección</Label>
                  <Input
                    type='text'
                    name='city_section'
                    value={formatName(record?.city_section?.name ?? '') ?? ''}
                    readOnly
                    className='cursor-not-allowed'
                  />
                </FormItem>
                <FormItem className='flex-none'>
                  <Label>Manzana</Label>
                  <Input
                    type='text'
                    name='block'
                    value={record?.block ?? ''}
                    readOnly
                    className='cursor-not-allowed'
                  />
                </FormItem>
                <FormItem className='flex-none'>
                  <Label>Parcela</Label>
                  <Input
                    type='text'
                    name='parcel'
                    value={record.parcel ?? ''}
                    readOnly
                    className='cursor-not-allowed'
                  />
                </FormItem>
              </div>

              <div className='w-full flex gap-3'>
                <FormItem className='flex-1'>
                  <Label>Fecha de alta</Label>
                  <Input
                    type='text'
                    name='registration_date'
                    value={
                      record?.registration_date
                        ? dayjs(record.registration_date).format('DD/MM/YYYY')
                        : ''
                    }
                    readOnly
                    className='cursor-not-allowed'
                  />
                </FormItem>
                <FormItem className='flex-1'>
                  <Label>Fecha de baja</Label>
                  <Input
                    type='text'
                    name='cancellation_date'
                    value={
                      record?.cancellation_date
                        ? dayjs(record.cancellation_date).format('DD/MM/YYYY')
                        : ''
                    }
                    readOnly
                    className='cursor-not-allowed'
                  />
                </FormItem>
              </div>

              <div className='w-full flex gap-3'>
                <FormItem className='flex-1'>
                  <Label>Nro de comprobante de alta</Label>
                  <Input
                    type='text'
                    name='registration_receipt'
                    value={record?.registration_receipt ?? ''}
                    readOnly
                    className='cursor-not-allowed'
                  />
                </FormItem>
                <FormItem className='flex-1'>
                  <Label>Nro de comprobante de baja</Label>
                  <Input
                    type='text'
                    name='cancellation_receipt'
                    value={record?.cancellation_receipt ?? ''}
                    readOnly
                    className='cursor-not-allowed'
                  />
                </FormItem>
              </div>

              <div className='w-full flex gap-3'>
                <FormItem className='flex-1'>
                  <Label>Alícuota de IIBB</Label>
                  <Input
                    type='text'
                    name='gross_income_rate'
                    value={record?.gross_income_rate ?? ''}
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
                  <Input type='text' name='observations' maxLength={50} />
                </FormItem>
                <FormItem className='flex-1'>
                  <Label>Importe</Label>
                  <Input
                    type='text'
                    name='amount'
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
      ) : (
        <></>
      )}
    </section>
  );
};
