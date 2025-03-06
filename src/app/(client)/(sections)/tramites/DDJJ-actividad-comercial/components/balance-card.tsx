'use client';

import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import { formatNumberToCurrency } from '@/lib/formatters';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BalanceCardProps {
  amount: number;
}

export function BalanceCard({ amount }: BalanceCardProps) {
  const { push } = useRouter();

  return (
    <Card className='w-full flex flex-col justify-between max-h-72 md:col-span-2'>
      <CardHeader>
        <CardTitle className='text-lg font-medium'>
          Monto adeudado a la fecha
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='text-4xl font-bold'>
          {formatNumberToCurrency(amount)}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant='outline'
          className='flex items-center gap-2'
          onClick={() =>
            push('/tramites/DDJJ-actividad-comercial/historial-pagos')
          }
        >
          Historial Pagos
        </Button>
        <Button
          variant='ghost'
          className='ml-auto'
          onClick={() => push('/tramites/DDJJ-actividad-comercial/pagar')}
        >
          <span>Ir a pagar</span>
          <ArrowRight className='h-5 w-5 ml-2' />
        </Button>
      </CardFooter>
    </Card>
  );
}
