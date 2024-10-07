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
import { Toast, ToastAction } from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';
import { validateReceiptCode } from '@/lib/code-generator';
import { receipt } from '@prisma/client';
import dayjs from 'dayjs';
import { CircleCheckBig, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { z } from 'zod';
import { confirmReceipt, getReceiptById } from '../receipt-actions';

export function ConfirmModal() {
  const [receiptData, setReceiptData] = useState<receipt | null>(null);
  const [error, setError] = useState<string>('');
  const [isSearching, startTransition] = useTransition();
  const [isMutating, startMutation] = useTransition();

  const { toast } = useToast();

  const { refresh } = useRouter();

  const handleSearch = (formData: FormData) => {
    startTransition(async () => {
      const receiptId = formData.get('receipt_id') as string;

      try {
        z.string()
          .refine((val) => validateReceiptCode(val), {
            message: 'El código del comprobante es inválido.',
          })
          .parse(receiptId);

        try {
          const receipt = await getReceiptById({
            id: receiptId,
          });

          if (receipt.data) {
            setError('');
            return setReceiptData(receipt.data);
          }

          setReceiptData(null);
          return setError(
            'No se encontró el comprobante de pago, intenta nuevamente.'
          );
        } catch (error) {
          console.error(error);
          setError(
            'No se encontró el comprobante de pago, intenta nuevamente.'
          );
        }
      } catch (error) {
        console.log({ error });
        if (error instanceof z.ZodError) {
          setError(error.errors[0].message);
        }
      }
    });
  };

  const handleSubmit = () => {
    startMutation(async () => {
      try {
        const receipt = await confirmReceipt({ data: receiptData! });

        if (receipt.success) {
          toast({
            title: 'Pago confirmado',
            description: 'El pago se ha confirmado correctamente.',
            action: (
              <Toast variant='default'>
                <ToastAction
                  altText='Por favor, recarga la página para ver los cambios'
                  onClick={refresh}
                >
                  Recargar
                </ToastAction>
              </Toast>
            ),
          });
        }
      } catch (error) {
        console.error(error);
        toast({
          title: 'Ocurrió un error',
          description: 'Hubo un error al confirmar el pago.',
          action: (
            <Toast variant='destructive'>
              <ToastAction altText='Vuelve a intentarlo más tarde'>
                Entendido
              </ToastAction>
            </Toast>
          ),
        });
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
                  placeholder='2024-000000'
                  required
                  onChange={() => setError('')}
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

              <div className='w-full flex gap-2'>
                <FormItem className='flex-1'>
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
                <FormItem className='flex-1'>
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
