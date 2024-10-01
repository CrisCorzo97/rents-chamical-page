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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { receipt } from '@prisma/client';
import { CircleCheckBig } from 'lucide-react';
import { useState, useTransition } from 'react';
import { getReceiptById } from '../receipt-actions';

export function ConfirmModal() {
  const [receiptData, setReceiptData] = useState<receipt | null>(null);
  const [isSearching, startTransition] = useTransition();

  const handleSearch = (formData: FormData) => {
    startTransition(async () => {
      const receiptId = formData.get('receipt_number') as string;

      try {
        const receipt = await getReceiptById({
          id: receiptId,
        });

        if (receipt.success) {
          setReceiptData(receipt.data);
        }
      } catch (error) {
        console.error(error);
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size='lg' variant='outline' className='flex gap-2'>
          <CircleCheckBig size={18} />
          Confirmar
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <form action={handleSearch}>
          <DialogHeader>
            <DialogTitle>Confirmar el pago de un comprobante</DialogTitle>
            <DialogDescription>
              Ingresa el número del comprobante para confirmar el pago.
            </DialogDescription>
          </DialogHeader>
          <div className='flex flex-col gap-3 my-6'>
            <Label htmlFor='receipt_number'>Comprobante N°:</Label>
            <Input type='number' id='receipt_number' placeholder='0000000000' />
          </div>

          <DialogFooter>
            <Button type='submit' loading={isSearching}>
              Confirmar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
