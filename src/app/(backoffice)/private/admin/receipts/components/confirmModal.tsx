import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { receipt } from '@prisma/client';
import dayjs from 'dayjs';
import { CircleCheckBig, Search } from 'lucide-react';
import { useState, useTransition } from 'react';
import { getReceiptById } from '../receipt-actions';

export function ConfirmModal() {
  const [receiptData, setReceiptData] = useState<receipt | null>(null);
  const [error, setError] = useState<string>('');
  const [isSearching, startTransition] = useTransition();
  const [isMutating, startMutation] = useTransition();

  const handleSearch = (formData: FormData) => {
    startTransition(async () => {
      const receiptId = formData.get('receipt_id') as string;

      try {
        const receipt = await getReceiptById({
          id: receiptId,
        });

        if (receipt.data) {
          setError('');
          return setReceiptData(receipt.data);
        }

        return setError(
          'No se encontró el comprobante de pago, intenta nuevamente.'
        );
      } catch (error) {
        console.error(error);
        setError('No se encontró el comprobante de pago, intenta nuevamente.');
      }
    });
  };

  const handleSubmit = (formData: FormData) => {
    startMutation(async () => {
      const receiptId = formData.get('receipt_id') as string;

      try {
        const receipt = await getReceiptById({
          id: receiptId,
        });

        if (receipt.success) {
          setReceiptData(receipt.data);
        }
      } catch (error) {
        console.error(error);
        setError('No se encontró el comprobante de pago, intenta nuevamente.');
      }
    });
  };

  return (
    <Dialog onOpenChange={() => setReceiptData(null)}>
      <DialogTrigger asChild>
        <Button size='lg' variant='outline' className='flex gap-2'>
          <CircleCheckBig size={18} />
          Confirmar
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Confirmar el pago de un comprobante</DialogTitle>
          <DialogDescription>
            Ingresa el número del comprobante para confirmar el pago.
          </DialogDescription>
        </DialogHeader>

        <div className='flex flex-col mt-6 '>
          <form action={handleSearch}>
            <FormItem>
              <Label htmlFor='receipt_id'>Comprobante N°:</Label>

              <div className='flex'>
                <Input
                  type='text'
                  name='receipt_id'
                  placeholder='0000000000'
                  required
                />
                <Button type='submit' loading={isSearching}>
                  <Search size={24} color='#FFF' />
                </Button>
              </div>
              {!!error && <p className='text-red-500 text-sm'>{error}</p>}
            </FormItem>
          </form>
        </div>

        <form action={handleSubmit}>
          {receiptData && (
            <div className='flex flex-col gap-3 mb-6'>
              <FormItem>
                <Label>Contribuyente</Label>
                <Input
                  type='text'
                  value={receiptData.taxpayer}
                  readOnly
                  className='cursor-not-allowed'
                />
              </FormItem>

              <div className='flex gap-2'>
                <FormItem>
                  <Label>Fecha de emisión</Label>
                  <Input
                    type='text'
                    value={dayjs(receiptData.created_at).format(
                      'DD/MM/YYYY HH:mm'
                    )}
                    readOnly
                    className='cursor-not-allowed'
                  />
                </FormItem>
                <FormItem>
                  <Label>Monto:</Label>
                  <Input
                    type='text'
                    value={receiptData.amount.toLocaleString('es-AR', {
                      style: 'currency',
                      currency: 'ARS',
                      maximumFractionDigits: 2,
                    })}
                    readOnly
                    className='cursor-not-allowed'
                  />
                </FormItem>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type='submit' loading={isMutating} disabled={!receiptData}>
              Confirmar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
