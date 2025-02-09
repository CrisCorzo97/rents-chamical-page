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

const formSchema = z.object({
  file: z
    .any()
    .refine((file) => file?.length === 1, 'Payment proof is required'),
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
      // In a real app, you would upload the file to a server here
      const file = values.file[0];

      // Simulate sending email with payment proof
      console.log('Sending email with payment proof:', file.name);

      // Update declaration status
      const updatedDeclaration: Declaration = {
        ...declaration,
        status: 'submitted',
        submissionDate: new Date().toISOString(),
        paymentProof: file.name,
      };

      onSubmit(updatedDeclaration);
    } catch (error) {
      console.error('Error submitting payment proof:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className='max-w-2xl mx-auto'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Upload className='h-5 w-5' />
          Upload Payment Proof
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
                <div className='font-medium'>Period:</div>
                <div>
                  {new Date(declaration.period).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                  })}
                </div>
                <div className='font-medium'>Gross Amount:</div>
                <div>${declaration.grossAmount.toLocaleString()}</div>
                <div className='font-medium'>Tax Amount (10%):</div>
                <div>${(declaration.grossAmount * 0.1).toLocaleString()}</div>
              </div>

              <FormField
                control={form.control}
                name='file'
                render={({ field: { onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Payment Proof</FormLabel>
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
                Cancel
              </Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Payment Proof'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
