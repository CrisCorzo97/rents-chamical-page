'use client';

import { Button, Input, Label, Select } from '@/components/ui';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Toaster } from '@/components/ui/sonner';
import { formatCurrency, formatDni } from '@/lib/formatters';
import { Envelope } from '@/types/envelope';
import { Prisma, receipt, tax_or_contribution } from '@prisma/client';
import { PDFViewer } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { createReceipt } from '../receipt-actions';
import { ReceiptPDF, ReceiptPDFProps } from './receiptPDF';

dayjs.extend(customParseFormat);

const formSchema = z.object({
  created_at: z.string().datetime(),
  tax_or_contribution_id: z.number(),
  taxpayer: z.string(),
  tax_id: z.string(),
  observations: z.string().optional(),
  amount: z.number(),
});

interface VariousRatesReceiptData {
  created_at: string;
  tax_or_contribution_id: number;
  taxpayer: string;
  tax_id: string;
  observations?: string;
  amount: number;
}

interface ReceiptFormProps {
  taxesOrContributions: tax_or_contribution[];
}

export const ReceiptForm = ({ taxesOrContributions }: ReceiptFormProps) => {
  const [amountValue, setAmountValue] = useState<string>('');
  const [taxId, setTaxId] = useState<string>('');
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const [contentDialog, setContentDialog] = useState<ReceiptPDFProps['data']>({
    receiptId: '',
    taxpayer: '',
    taxId: '',
    taxOrContibution: '',
    observations: '',
    amount: 0,
  });

  const handleFormSubmit = (formData: FormData) => {
    startTransition(async () => {
      const formDataObject = Object.fromEntries(formData.entries());

      const parsedDataObject: VariousRatesReceiptData = {
        created_at: dayjs().toISOString(),
        tax_or_contribution_id: Number(
          formDataObject.tax_or_contribution_id as string
        ),
        taxpayer: formDataObject.taxpayer as string,
        tax_id: formDataObject.tax_id as string,
        observations: formDataObject.observations as string,
        amount: Number(
          (formDataObject.amount as string)
            .replace(/[.$]/g, '')
            .replace(',', '.')
            .trim()
        ),
      };

      try {
        // Validar los datos usando el esquema de Zod
        formSchema.parse(parsedDataObject);

        try {
          const createData: Omit<Prisma.receiptCreateInput, 'id'> = {
            created_at: parsedDataObject.created_at,
            taxpayer: parsedDataObject.taxpayer.toUpperCase(),
            amount: parsedDataObject.amount,
            tax_type: 'TASAS DIVERSAS',
            other_data: {
              tax_id: parsedDataObject.tax_id,
              observations: parsedDataObject.observations,
              tax_or_contribution: taxesOrContributions
                .find(
                  (tax) =>
                    Number(tax.id) === parsedDataObject.tax_or_contribution_id
                )
                ?.name.toUpperCase(),
            },
          };

          const { data, error }: Envelope<receipt> = await createReceipt({
            data: createData,
          });

          if (!data || !!error) {
            throw new Error(error ?? '');
          }

          // Actualizar el contenido del diálogo con los datos del comprobante
          setContentDialog({
            receiptId: data?.id ?? '',
            taxpayer: parsedDataObject.taxpayer,
            taxId: parsedDataObject.tax_id,
            taxOrContibution:
              taxesOrContributions.find(
                (toc) =>
                  Number(toc.id) === parsedDataObject.tax_or_contribution_id
              )?.name ?? '',
            observations: parsedDataObject.observations ?? '',
            amount: parsedDataObject.amount,
          });

          // Mostrar el diálogo de confirmación
          setOpenDialog(true);
        } catch (error) {
          console.log(error);
          toast.error(
            'Error al generar el comprobante de tasas diversas. Intente nuevamente.',
            { duration: 5000 }
          );
        }
      } catch (error) {
        console.log({ error });
        if (error instanceof z.ZodError) {
          console.error(error.errors);
        }
      }
    });
  };

  return (
    <section>
      <Toaster />
      <Card className='mt-6 max-w-3xl'>
        <CardHeader>
          <CardTitle>Comprobante de Tasas Diversas</CardTitle>
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
                <Label>Tasa o Contribución</Label>
                <Select name='tax_or_contribution_id' required>
                  <SelectTrigger className='text-start'>
                    <SelectValue placeholder='Elige una tasa o contribución' />
                  </SelectTrigger>
                  <SelectContent className='border-none'>
                    <ScrollArea className='h-60 w-full rounded-md'>
                      {taxesOrContributions.map((toc) => (
                        <SelectItem key={toc.id} value={`${toc.id}`}>
                          {toc.name}
                        </SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
              </FormItem>
            </div>

            <div className='w-full flex flex-wrap gap-3'>
              <FormItem className='flex-1'>
                <Label>Apellido y nombre del contribuyente</Label>
                <Input type='text' name='taxpayer' required />
              </FormItem>
              <FormItem className='flex-none'>
                <Label>D.N.I.</Label>
                <Input
                  type='text'
                  name='tax_id'
                  required
                  value={taxId}
                  onChange={(val) => {
                    setTaxId(formatDni(val.target.value));
                  }}
                />
              </FormItem>
            </div>

            <div className='w-full flex gap-3'>
              <FormItem className='flex-1'>
                <Label>Observaciones</Label>
                <Input type='text' name='observations' maxLength={70} />
              </FormItem>
              <FormItem className='flex-none'>
                <Label>Importe</Label>
                <Input
                  type='text'
                  name='amount'
                  className='flex-1'
                  value={amountValue}
                  onChange={(e) =>
                    setAmountValue(formatCurrency(e.target.value))
                  }
                  required
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
                      <Link href='/private/admin/receipts'>
                        <AlertDialogAction onClick={() => setOpenDialog(false)}>
                          Continuar
                        </AlertDialogAction>
                      </Link>
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
