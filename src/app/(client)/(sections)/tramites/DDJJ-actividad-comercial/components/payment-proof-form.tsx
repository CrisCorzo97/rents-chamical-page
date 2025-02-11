'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { Declaration } from '../types';
import { formatCurrency } from '@/lib/formatters';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { FormItem, Input, Label } from '@/components/ui';
dayjs.locale('es');

interface PaymentProofFormProps {
  declaration: Declaration;
  onSubmit: (declaration: Declaration) => void;
  onCancel: () => void;
}

export default function PaymentProofForm({
  declaration,
  onSubmit,
  onCancel,
}: PaymentProofFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      alert('El comprobante de pago es obligatorio');
      return;
    }

    setIsSubmitting(true);
    try {
      // En una aplicación real, subirías el archivo a un servidor aquí
      console.log('Enviando correo con el comprobante de pago:', file.name);

      // Actualizar el estado de la declaración
      const updatedDeclaration: Declaration = {
        ...declaration,
        status: 'payment_review',
        submissionDate: dayjs().format('YYYY-MM-DD'),
        paymentProof: file.name,
      };

      onSubmit(updatedDeclaration);
    } catch (error) {
      console.error('Error al enviar el comprobante de pago:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className='max-w-2xl mx-auto'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Upload className='h-5 w-5' />
          Subir Comprobante de Pago
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-4'>
            <div className='grid grid-cols-2 gap-4 text-sm'>
              <div className='font-medium'>Período:</div>
              <div>{dayjs(declaration.period).format('MM/YYYY')}</div>
              <div className='font-medium'>Importe Bruto:</div>
              <div>{formatCurrency(`${declaration.grossAmount}`)}</div>
              <div className='font-medium'>Importe del Impuesto (10%):</div>
              <div>{formatCurrency(`${declaration.grossAmount * 0.1}`)}</div>
              <div className='border-t pt-4 mt-4 col-span-2'>
                <h3 className='font-medium mb-2'>Instrucciones de Pago</h3>
                <p className='text-sm text-gray-600 mb-2'>
                  Por favor transfiera el monto a la siguiente cuenta:
                </p>
                <div className='bg-blue-100 p-3 rounded-md text-sm'>
                  <div>
                    <strong>Banco:</strong> Banco Nación Argentina
                  </div>
                  <div>
                    <strong>Cuenta:</strong> 000-123456-789
                  </div>
                  <div>
                    <strong>CBU:</strong> 0000000000000000000000
                  </div>
                </div>
              </div>
            </div>

            <FormItem>
              <Label className='block text-sm font-medium text-gray-700'>
                Comprobante de Pago
              </Label>
              <Input
                type='file'
                accept='.pdf,.jpg,.jpeg,.png'
                onChange={(e) =>
                  setFile(e.target.files ? e.target.files[0] : null)
                }
                className='mt-1 block w-full'
              />
            </FormItem>
          </div>

          <div className='flex justify-end space-x-4'>
            <Button type='button' variant='outline' onClick={onCancel}>
              Cancelar
            </Button>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Enviar Comprobante de Pago'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
