'use client';

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
} from '@/components/ui';

interface Period {
  month: string;
  year: number;
  dueDate: string;
  amount: number;
  selected?: boolean;
}

interface PeriodSelectionCardProps {
  periods: Period[];
  onSelectionChange: (periods: Period[]) => void;
  onProceedToPayment: () => void;
}

export function PeriodSelectionCard({
  periods,
  onSelectionChange,
  onProceedToPayment,
}: PeriodSelectionCardProps) {
  const totalAmount = periods
    .filter((period) => period.selected)
    .reduce((sum, period) => sum + period.amount, 0);

  const handlePeriodToggle = (index: number) => {
    const updatedPeriods = periods.map((period, i) =>
      i === index ? { ...period, selected: !period.selected } : period
    );
    onSelectionChange(updatedPeriods);
  };

  return (
    <Card className='w-full max-w-md bg-gradient-to-br from-red-900 to-red-950 text-white'>
      <CardHeader>
        <CardTitle className='text-lg font-medium text-white/90'>
          Selecciona los ítems a pagar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <div className='grid grid-cols-3 gap-4 px-3 text-sm text-white/70'>
            <div>Período</div>
            <div>Vencimiento</div>
            <div>Monto</div>
          </div>
          {periods.map((period, index) => (
            <div
              key={index}
              className='flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3'
            >
              <div className='grid grid-cols-3 flex-1 gap-4'>
                <div className='text-sm'>
                  {period.month} {period.year}
                </div>
                <div className='text-sm text-white/70'>{period.dueDate}</div>
                <div className='text-sm'>
                  ${period.amount.toLocaleString('es-AR')}
                </div>
              </div>
              <Checkbox
                checked={period.selected}
                onCheckedChange={() => handlePeriodToggle(index)}
                className='ml-4 h-5 w-5 border-white/30 data-[state=checked]:border-white data-[state=checked]:bg-white/20'
              />
            </div>
          ))}
          <div className='flex items-center justify-between border-t border-white/10 pt-4'>
            <div className='text-sm font-medium'>Total a abonar:</div>
            <div className='text-lg font-bold'>
              ${totalAmount.toLocaleString('es-AR')}
            </div>
          </div>
          <Button
            onClick={onProceedToPayment}
            className='w-full bg-white/10 hover:bg-white/20'
            disabled={totalAmount === 0}
          >
            Ir a pagar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
