'use client';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  FormItem,
  Input,
  Label,
} from '@/components/ui';
import { Button } from '@/components/ui/button';
import dayjs from 'dayjs';
import { useState } from 'react';
import locale from 'dayjs/locale/es';
import utc from 'dayjs/plugin/utc';
import Link from 'next/link';
import { formatCuilInput } from '@/lib/formatters';
dayjs.locale(locale);
dayjs.extend(utc);

export const CreateInvoiceButton = () => {
  const [taxId, setTaxId] = useState<string>('');

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size='sm' className='w-full md:w-fit'>
          Nueva Factura
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva Factura</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Ingresá el CUIT del contribuyente a quien se le generará una nueva
          factura.
        </DialogDescription>
        <div className='flex flex-col gap-2'>
          <FormItem>
            <Label>CUIT</Label>
            <Input
              value={taxId}
              onChange={(e) => setTaxId(formatCuilInput(e.target.value))}
              placeholder='00-12345678-9'
            />
          </FormItem>
        </div>
        <DialogFooter className='mt-4'>
          <DialogClose asChild>
            <Button variant='outline'>Cancelar</Button>
          </DialogClose>
          <Link
            href={`/private/admin/collection_management/create-invoice?taxId=${taxId}`}
          >
            <Button disabled={!taxId}>Continuar</Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
