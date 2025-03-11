'use client';

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
} from '@/components/ui';
import { ConceptToPay } from '../types';
import { useMemo, useState } from 'react';
import { formatNumberToCurrency } from '@/lib/formatters';

interface PeriodSelectionCardProps {
  concepts: ConceptToPay[];
}

export function PeriodSelectionCard({ concepts }: PeriodSelectionCardProps) {
  const [conceptsSelected, setConceptsSelected] = useState<ConceptToPay[]>([]);

  const totalAmount = useMemo(() => {
    return conceptsSelected.reduce((acc, concept) => {
      return acc + concept.amount;
    }, 0);
  }, [conceptsSelected]);

  return (
    <Card className='w-full max-w-4xl'>
      <CardHeader>
        <CardTitle className='text-lg font-medium'>
          Selecciona los conceptos a pagar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4 grid grid-cols-4'>
          <div className='col-span-4 grid grid-cols-4 gap-4 px-3 text-sm text-muted-foreground'>
            <div>Período</div>
            <div>Concepto</div>
            <div>Vencimiento</div>
            <div>Monto</div>
          </div>
          {concepts.map((concept) => (
            <div
              key={concept.id}
              className='col-span-4 flex items-center justify-between rounded-lg border p-3'
            >
              <div className='grid grid-cols-4 flex-1 gap-4'>
                <div className='text-sm'>{concept.period}</div>
                <div className='text-sm'>{concept.concept}</div>
                <div className='text-sm text-muted-foreground'>
                  {concept.dueDate}
                </div>
                <div className='text-sm'>
                  {formatNumberToCurrency(concept.amount)}
                </div>
              </div>
              <Checkbox
                checked={conceptsSelected.some(
                  (selected) => selected.id === concept.id
                )}
                onCheckedChange={() =>
                  setConceptsSelected((prev) => {
                    if (prev.some((selected) => selected.id === concept.id)) {
                      return prev.filter(
                        (selected) => selected.id !== concept.id
                      );
                    }

                    return [...prev, concept];
                  })
                }
                className='ml-4 h-5 w-5'
              />
            </div>
          ))}
          <div className='col-span-4 flex items-center justify-between border-t pt-4'>
            <div className='text-sm font-medium'>Total a abonar:</div>
            <div className='text-lg font-bold'>
              {formatNumberToCurrency(totalAmount)}
            </div>
          </div>
          <Button
            onClick={() => console.log('Ir a pagar')}
            className='col-start-4 w-full'
            disabled={totalAmount === 0}
          >
            Ir a pagar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
