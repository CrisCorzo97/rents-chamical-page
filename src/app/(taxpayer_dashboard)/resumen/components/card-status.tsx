'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BadgeCheck } from 'lucide-react';

export const CardStatus = ({ isUpToDate }: { isUpToDate: boolean }) => {
  return (
    <Card className='h-52 flex flex-col justify-between md:col-span-6 xl:col-span-5'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle>Estado del Contribuyente</CardTitle>
        <BadgeCheck className='h-6 w-6 text-muted-foreground' />
      </CardHeader>
      <CardContent className='flex items-center gap-2'>
        <div
          className={`h-3 w-3 rounded-full ${
            isUpToDate ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
        <span className='text-sm font-medium'>
          {isUpToDate
            ? '¡Estás al día!'
            : 'Tienes pagos pendientes o en revisión.'}
        </span>
      </CardContent>
      <CardFooter>
        <Button className='w-full' disabled={!isUpToDate}>
          Generar Oblea
        </Button>
      </CardFooter>
    </Card>
  );
};
