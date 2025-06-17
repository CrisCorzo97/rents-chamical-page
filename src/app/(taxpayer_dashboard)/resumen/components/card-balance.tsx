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
import { Skeleton } from '@/components/ui/skeleton';

export const CardBalanceSkeleton = () => {
  return (
    <Card className='h-52 flex flex-col justify-between md:col-span-6 2xl:col-span-5 2xl:col-start-1'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle>Balance General</CardTitle>
        <CreditCard className='h-6 w-6 text-muted-foreground' />
      </CardHeader>
      <CardContent>
        <Skeleton className='h-10 w-32 bg-border' />
      </CardContent>
      <CardFooter className='flex gap-4'>
        <Skeleton className='h-10 flex-1 bg-border' />
        <Skeleton className='h-10 flex-1 bg-border' />
      </CardFooter>
    </Card>
  );
};

export const CardBalance = ({ balance }: { balance: number }) => {
  const router = useRouter();
  return (
    <Card className='h-52 flex flex-col justify-between md:col-span-6 2xl:col-span-5 2xl:col-start-1'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle>Balance General</CardTitle>
        <CreditCard className='h-6 w-6 text-muted-foreground' />
      </CardHeader>
      <CardContent className='text-3xl font-bold text-gray-700'>
        {formatNumberToCurrency(balance ?? 0)}
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
          disabled={balance === 0 || balance === null}
        >
          Pagar
        </Button>
      </CardFooter>
    </Card>
  );
};
