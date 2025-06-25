'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { formatName, formatNumberToCurrency } from '@/lib/formatters';
import { affidavit } from '@prisma/client';
import dayjs from 'dayjs';
import { useMemo, useState, useTransition } from 'react';
import { toast, Toaster } from 'sonner';
import utc from 'dayjs/plugin/utc';
import { createInvoice } from '../actions';
import { useRouter } from 'next/navigation';
import { buildQuery } from '@/lib/url';
import locale from 'dayjs/locale/es';

dayjs.extend(utc);
dayjs.locale(locale);

export const CreateInvoicePageClient = ({
  affidavits,
}: {
  affidavits: affidavit[];
}) => {
  const [selectedAffidavits, setSelectedAffidavits] = useState<affidavit[]>([]);
  const [isGenerating, startInvoiceTransition] = useTransition();

  const router = useRouter();

  const totalAmount = useMemo(() => {
    return selectedAffidavits.reduce((acc, affidavit) => {
      return acc + affidavit.fee_amount;
    }, 0);
  }, [selectedAffidavits]);

  const onConfirm = () => {
    startInvoiceTransition(async () => {
      try {
        const { data, error } = await createInvoice({
          affidavit_ids: selectedAffidavits.map((affidavit) => affidavit.id),
          user_id: selectedAffidavits[0].taxpayer_id,
        });

        if (error || !data) {
          toast.error(error ?? 'Ocurrió un error al generar la factura');
          return;
        }

        toast.success('Factura generada correctamente');
        router.replace(
          `/private/admin/collection_management${buildQuery({
            'filter.id': data.id,
          })}`
        );
      } catch (error) {
        console.error(error);
      }
    });
  };

  return (
    <Card className='md:col-span-12 2xl:col-span-10'>
      <CardHeader>
        <CardTitle className='text-lg font-medium'>
          Seleccioná las declaraciones a incluir en la factura
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Toaster />
        <div className='space-y-4 grid grid-cols-4'>
          <div className='col-span-4 grid grid-cols-4 gap-4 px-3 text-sm text-muted-foreground'>
            <div>Período</div>
            <div>Concepto</div>
            <div>Vencimiento</div>
            <div>Monto</div>
          </div>
          {affidavits.length > 0 ? (
            affidavits.map((affidavit) => (
              <div
                key={affidavit.id}
                className='col-span-4 flex items-center justify-between rounded-lg border p-3'
              >
                <div className='grid grid-cols-4 flex-1 gap-4'>
                  <div className='text-sm'>
                    {formatName(dayjs(affidavit.period).format('MMMM YYYY'))}
                  </div>
                  <div className='text-sm'>DDJJ Actividad Comercial</div>
                  <div className='text-sm text-muted-foreground'>
                    {dayjs(affidavit.payment_due_date).format('DD/MM/YYYY')}
                  </div>
                  <div className='text-sm'>
                    {formatNumberToCurrency(affidavit.fee_amount)}
                  </div>
                </div>
                <Checkbox
                  checked={selectedAffidavits.some(
                    (selected) => selected.id === affidavit.id
                  )}
                  onCheckedChange={() =>
                    setSelectedAffidavits((prev) => {
                      if (
                        prev.some((selected) => selected.id === affidavit.id)
                      ) {
                        return prev.filter(
                          (selected) => selected.id !== affidavit.id
                        );
                      }

                      return [...prev, affidavit];
                    })
                  }
                  className='ml-4 h-5 w-5'
                />
              </div>
            ))
          ) : (
            <div className='col-span-4 flex items-center justify-center'>
              <p className='text-sm text-muted-foreground'>
                No hay declaraciones para generar la factura.
              </p>
            </div>
          )}
          <div className='col-span-4 flex items-center justify-between border-t pt-4'>
            <div className='text-sm font-medium'>
              Total a abonar sin intereses:
            </div>
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
  );
};
