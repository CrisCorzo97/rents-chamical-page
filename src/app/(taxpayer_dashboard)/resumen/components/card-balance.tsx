'use client';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CreditCard } from 'lucide-react';
import { formatNumberToCurrency } from '@/lib/formatters';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export const CardBalance = ({ amount }: { amount: number }) => {
  const router = useRouter();
  return (
    <Card className='h-52 flex flex-col justify-between md:col-span-6 xl:col-span-5 xl:col-start-1'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle>Balance General</CardTitle>
        <CreditCard className='h-6 w-6 text-muted-foreground' />
      </CardHeader>
      <CardContent className='text-3xl font-bold text-gray-700'>
        {formatNumberToCurrency(amount)}
      </CardContent>
      <CardFooter className='flex gap-4'>
        <Button
          key='payments'
          variant='outline'
          className='w-full'
          onClick={() => {
            router.push('/mis-pagos');
          }}
        >
          Mis pagos
        </Button>

        <Button
          key='pay'
          className='w-full'
          onClick={() => {
            router.push('/pagos/nuevo-pago');
          }}
          disabled={amount === 0}
        >
          Pagar
        </Button>
      </CardFooter>
    </Card>
  );
};
