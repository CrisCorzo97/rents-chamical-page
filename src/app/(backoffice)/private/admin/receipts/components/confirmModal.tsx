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
import { CircleCheckBig } from 'lucide-react';

export function ConfirmModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size='lg' variant='outline' className='flex gap-2'>
          <CircleCheckBig size={18} />
          Confirmar
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
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
          <Button type='submit'>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
