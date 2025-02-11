'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Upload } from 'lucide-react';
import { Declaration } from '../types';
import { formatCurrency } from '@/lib/formatters';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');

const formSchema = z.object({
  file: z
    .any()
    .refine(
      (file) => file?.length === 1,
      'El comprobante de pago es obligatorio'
    ),
});

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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      // En una aplicación real, subirías el archivo a un servidor aquí
      const file = values.file[0];

      // Simular el envío de correo con el comprobante de pago
      console.log('Enviando correo con el comprobante de pago:', file.name);

      // Actualizar el estado de la declaración
      const updatedDeclaration: Declaration = {
        ...declaration,
        status: 'payment_review',
        submissionDate: new Date().toISOString(),
        paymentProof: file.name,
      };

      onSubmit(updatedDeclaration);
    } catch (error) {
      console.error('Error al enviar el comprobante de pago:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log({ declaration });

  return (
    <Card className='max-w-2xl mx-auto'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Upload className='h-5 w-5' />
          Subir Comprobante de Pago
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-6'
          >
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4 text-sm'>
                <div className='font-medium'>Período:</div>
                <div>{declaration.period}</div>
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

              <FormField
                control={form.control}
                name='file'
                render={({ field: { onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Comprobante de Pago</FormLabel>
                    <FormControl>
                      <Input
                        type='file'
                        accept='.pdf,.jpg,.jpeg,.png'
                        onChange={(e) => onChange(e.target.files)}
                        className='cursor-pointer'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
        </Form>
      </CardContent>
    </Card>
  );
}
