'use client';

import { useState, useTransition } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@/components/ui';
import { updateInvoice } from '../affidavit.actions';
import { toast, Toaster } from 'sonner';
import { useRouter } from 'next/navigation';

interface BankDetails {
  bank: string;
  company_name: string;
  tax_id: string;
  account_number: string;
  cbu: string;
  alias: string;
}

interface PaymentInstructionsCardProps {
  invoiceId: string;
  bankDetails: BankDetails;
}

export function PaymentInstructionsCard({
  invoiceId,
  bankDetails,
}: PaymentInstructionsCardProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, startTransition] = useTransition();

  const { replace } = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const onUpload = () => {
    startTransition(async () => {
      try {
        const { error } = await updateInvoice({
          invoice_id: invoiceId,
          attachment_file: selectedFile!,
        });

        if (error) {
          toast.error(error);
          return;
        }

        toast.success('El comprobante fue enviado correctamente.');

        return replace('/tramites/DDJJ-actividad-comercial');
      } catch (error) {
        toast.error(
          'Ocurrió un error al subir el archivo. Por favor, intenta nuevamente.'
        );
      }
    });
  };

  return (
    <>
      <Toaster />
      <Card className='w-full max-w-4xl'>
        <CardHeader>
          <CardTitle className='text-lg font-medium'>
            Por favor, realiza el pago a la siguiente cuenta y adjunta el
            comprobante del mismo.
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='rounded-lg border bg-card p-4'>
            <div className='space-y-2'>
              <div className='flex justify-between'>
                <span className='font-medium'>Banco:</span>
                <span>{bankDetails.bank}</span>
              </div>
              <div className='flex justify-between'>
                <span className='font-medium'>CUIT:</span>
                <span>{bankDetails.tax_id}</span>
              </div>
              <div className='flex justify-between'>
                <span className='font-medium'>Razón Social:</span>
                <span>{bankDetails.company_name}</span>
              </div>
              <div className='flex justify-between'>
                <span className='font-medium'>Nro de cuenta:</span>
                <span>{bankDetails.account_number}</span>
              </div>
              <div className='flex justify-between'>
                <span className='font-medium'>CBU:</span>
                <span>{bankDetails.cbu}</span>
              </div>
              <div className='flex justify-between'>
                <span className='font-medium'>Alias:</span>
                <span>{bankDetails.alias}</span>
              </div>
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='file-upload'>Selecciona un archivo:</Label>
            <Input
              id='file-upload'
              type='file'
              accept='.pdf,.jpg,.jpeg,.png'
              onChange={handleFileChange}
            />
          </div>

          <CardFooter className='p-0 pt-4 flex justify-end'>
            <Button
              onClick={onUpload}
              loading={isUploading}
              disabled={!selectedFile}
            >
              Enviar comprobante
            </Button>
          </CardFooter>
        </CardContent>
      </Card>
    </>
  );
}
