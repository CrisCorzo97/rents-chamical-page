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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Declaration } from '../types';

const formSchema = z.object({
  period: z.string().min(1, 'Period is required'),
  grossAmount: z.string().min(1, 'Gross amount is required').transform(Number),
});

interface DeclarationFormProps {
  onSubmit: (declaration: Declaration) => void;
  onCancel: () => void;
}

export default function DeclarationForm({
  onSubmit,
  onCancel,
}: DeclarationFormProps) {
  const [step, setStep] = useState(1);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      period: '',
      grossAmount: 0,
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (step === 1) {
      setStep(2);
    } else {
      const declaration: Declaration = {
        id: Math.random().toString(36).substr(2, 9),
        period: values.period,
        grossAmount: values.grossAmount,
        status: 'pending',
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
          .toISOString()
          .split('T')[0],
      };
      onSubmit(declaration);
    }
  };

  const getPeriods = () => {
    const periods = [];
    const currentDate = new Date();
    for (let i = 0; i < 6; i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      periods.push({
        value: date.toISOString().slice(0, 7),
        label: new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'long',
        }).format(date),
      });
    }
    return periods;
  };

  return (
    <Card className='max-w-2xl mx-auto'>
      <CardHeader>
        <CardTitle>
          {step === 1 ? 'New Tax Declaration' : 'Declaration Summary'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-6'
          >
            {step === 1 ? (
              <>
                <FormField
                  control={form.control}
                  name='period'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Declaration Period</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select period' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {getPeriods().map((period) => (
                            <SelectItem key={period.value} value={period.value}>
                              {period.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='grossAmount'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gross Amount</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='Enter amount'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ) : (
              <div className='space-y-4'>
                <div className='grid grid-cols-2 gap-4 text-sm'>
                  <div className='font-medium'>Period:</div>
                  <div>{form.getValues('period')}</div>
                  <div className='font-medium'>Gross Amount:</div>
                  <div>${form.getValues('grossAmount')}</div>
                  <div className='font-medium'>Tax Amount (10%):</div>
                  <div>${Number(form.getValues('grossAmount')) * 0.1}</div>
                </div>
                <div className='border-t pt-4 mt-4'>
                  <h3 className='font-medium mb-2'>Payment Instructions</h3>
                  <p className='text-sm text-gray-600 mb-2'>
                    Please transfer the amount to the following account:
                  </p>
                  <div className='bg-blue-100 p-3 rounded-md text-sm'>
                    <div>
                      <strong>Bank:</strong> National Tax Bank
                    </div>
                    <div>
                      <strong>Account:</strong> 000-123456-789
                    </div>
                    <div>
                      <strong>CBU:</strong> 0000000000000000000000
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className='flex justify-end space-x-4'>
              <Button type='button' variant='outline' onClick={onCancel}>
                Cancel
              </Button>
              <Button type='submit'>
                {step === 1 ? 'Continue' : 'Submit Declaration'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
