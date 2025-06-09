'use client';

import { BadgeCheck, CreditCard } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DataTable } from '@/components/custom-table/data-table';
import { columns } from './components/columns';
import { formatNumberToCurrency } from '@/lib/formatters';

// Mock de datos basado en affidavits y tax_penalties
const mockData = {
  balance: {
    total: 15000.0,
    breakdown: {
      pendingAffidavits: 12000.0, // DDJJ pendientes de pago
      unpaidPenalties: 3000.0, // Multas sin pagar
    },
  },
  taxpayerStatus: {
    isUpToDate: false,
    lastPayment: '2024-03-15',
    nextDueDate: '2024-04-06',
  },
  upcomingDueDates: [
    {
      id: '1',
      tax_name: 'DDJJ Actividad Comercial',
      period: 'Abril 2025',
      due_date: '04/06/2025',
    },
    {
      id: '2',
      tax_name: 'DDJJ Actividad Comercial',
      period: 'Mayo 2025',
      due_date: '04/06/2025',
    },
    {
      id: '3',
      tax_name: 'DDJJ Actividad Comercial',
      period: 'Junio 2025',
      due_date: '05/08/2025',
    },
    {
      id: '4',
      tax_name: 'DDJJ Actividad Comercial',
      period: 'Julio 2025',
      due_date: '05/08/2025',
    },
  ],
};

export default function ResumenPage() {
  return (
    <div className='flex flex-col gap-4'>
      <div className='grid gap-4 md:grid-cols-12'>
        {/* Card de Balance */}
        <Card className='h-48 flex flex-col justify-between md:col-span-5 md:col-start-2'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle>Balance General</CardTitle>
            <CreditCard className='h-6 w-6 text-muted-foreground' />
          </CardHeader>
          <CardContent className='text-3xl font-bold text-gray-700'>
            {formatNumberToCurrency(mockData.balance.total)}
          </CardContent>
          <CardFooter className='flex gap-4'>
            <Button variant='outline' className='w-full'>
              Mis pagos
            </Button>
            <Button className='w-full'>Pagar</Button>
          </CardFooter>
        </Card>

        {/* Card de Estado */}
        <Card className='h-48 flex flex-col justify-between md:col-span-5'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle>Estado del Contribuyente</CardTitle>
            <BadgeCheck className='h-6 w-6 text-muted-foreground' />
          </CardHeader>
          <CardContent className='flex items-center gap-2'>
            <div
              className={`h-3 w-3 rounded-full ${
                mockData.taxpayerStatus.isUpToDate
                  ? 'bg-green-500'
                  : 'bg-red-500'
              }`}
            />
            <span className='text-sm font-medium'>
              {mockData.taxpayerStatus.isUpToDate
                ? '¡Estás al día!'
                : 'Tienes pagos pendientes o en revisión.'}
            </span>
          </CardContent>
          <CardFooter>
            <Button
              className='w-full'
              disabled={!mockData.taxpayerStatus.isUpToDate}
            >
              Generar Oblea
            </Button>
          </CardFooter>
        </Card>

        {/* Tabla de Próximos Vencimientos */}
        <Card className='md:col-span-10 md:col-start-2'>
          <CardContent>
            <DataTable
              tableTitle='Próximos Vencimientos'
              columns={columns}
              data={mockData.upcomingDueDates}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
