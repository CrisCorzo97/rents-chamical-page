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
import { useMemo, useState, useTransition } from 'react';
import { formatNumberToCurrency } from '@/lib/formatters';
import { createInvoice } from '../affidavit.actions';
import { toast, Toaster } from 'sonner';
import { useRouter } from 'next/navigation';

interface PeriodSelectionCardProps {
  concepts: ConceptToPay[];
}

export function PeriodSelectionCard({ concepts }: PeriodSelectionCardProps) {
  const [conceptsSelected, setConceptsSelected] = useState<ConceptToPay[]>([]);
  const [isGenerating, startInvoiceTransition] = useTransition();

  const { replace } = useRouter();

  const totalAmount = useMemo(() => {
    return conceptsSelected.reduce((acc, concept) => {
      return acc + concept.amount;
    }, 0);
  }, [conceptsSelected]);

  const onConfirm = () => {
    startInvoiceTransition(async () => {
      const affidavit_ids: string[] = [];
      const tax_penaltie_ids: string[] = [];

      for (const concept of conceptsSelected) {
        if (concept.concept === 'Declaración Jurada') {
          affidavit_ids.push(concept.id);
        } else {
          tax_penaltie_ids.push(concept.id);
        }
      }

      try {
        const { data, error } = await createInvoice({
          affidavit_ids,
          tax_penaltie_ids,
        });

        if (error || !data) {
          toast.error(error ?? 'Ocurrió un error al generar la factura');
          return;
        }

        toast.success('Factura generada con éxito');

        return replace(`/tramites/DDJJ-actividad-comercial/pagar/${data.id}`);
      } catch (error) {
        console.error(error);
        toast.error('Ocurrió un error al generar la factura');
      }
    });
  };

  return (
    <>
      <Toaster />
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
              onClick={onConfirm}
              loading={isGenerating}
              className='col-start-4 w-full'
              disabled={totalAmount === 0}
            >
              Confirmar
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
