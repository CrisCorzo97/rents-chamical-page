'use client';

import { useState } from 'react';
import { Download, Upload } from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
} from '@/components/ui';

interface BankDetails {
  bank: string;
  account: string;
  cbu: string;
}

interface PaymentInstructionsCardProps {
  bankDetails: BankDetails;
  onFileUpload: (file: File) => void;
  onDownloadInvoice: () => void;
  onContinue: () => void;
}

export function PaymentInstructionsCard({
  bankDetails,
  onFileUpload,
  onDownloadInvoice,
  onContinue,
}: PaymentInstructionsCardProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFileUpload(file);
    }
  };

  return (
    <Card className='w-full max-w-md bg-gradient-to-br from-red-900 to-red-950 text-white'>
      <CardHeader>
        <CardTitle className='text-lg font-medium text-white/90'>
          Por favor, realiza el pago a la siguiente cuenta y adjunta el
          comprobante del mismo.
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <div className='rounded-lg bg-white/10 p-4'>
            <div className='space-y-2'>
              <div className='flex justify-between'>
                <span className='text-sm text-white/70'>Bank:</span>
                <span className='font-medium'>{bankDetails.bank}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-sm text-white/70'>Account:</span>
                <span className='font-medium'>{bankDetails.account}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-sm text-white/70'>CBU:</span>
                <span className='font-medium'>{bankDetails.cbu}</span>
              </div>
            </div>
          </div>

          <div className='space-y-2'>
            <label className='text-sm text-white/90'>
              Selecciona un archivo:
            </label>
            <div className='relative'>
              <Input
                type='file'
                accept='.pdf,.jpg,.jpeg,.png'
                onChange={handleFileChange}
                className='hidden'
                id='file-upload'
              />
              <div className='flex items-center gap-2'>
                <Button
                  asChild
                  variant='outline'
                  className='w-full border-white/20 bg-white/5 text-white hover:bg-white/10'
                >
                  <label htmlFor='file-upload' className='cursor-pointer'>
                    <Upload className='mr-2 h-4 w-4' />
                    {selectedFile ? selectedFile.name : 'Seleccionar archivo'}
                  </label>
                </Button>
              </div>
            </div>
          </div>

          <div className='flex gap-2 pt-4'>
            <Button
              variant='outline'
              onClick={onDownloadInvoice}
              className='flex-1 border-white/20 bg-white/5 text-white hover:bg-white/10'
            >
              <Download className='mr-2 h-4 w-4' />
              Descargar Factura
            </Button>
            <Button
              onClick={onContinue}
              className='flex-1 bg-white/10 hover:bg-white/20'
              disabled={!selectedFile}
            >
              Continuar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
