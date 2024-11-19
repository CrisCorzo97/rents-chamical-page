'use client';

import { Button, Popover } from '@/components/ui';
import { PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { daily_box_report } from '@prisma/client';
import { FileChartColumnIncreasing } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast, Toaster } from 'sonner';
import { generateDailyBoxReport } from '../receipt-actions';

export const DailyBoxReport = () => {
  const [isMutating, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [contentDialog, setContentDialog] = useState<daily_box_report>();

  const handleClick = () => {
    startTransition(async () => {
      try {
        const { data, error } = await generateDailyBoxReport();

        if (error || !data) {
          throw new Error(error ?? '');
        }

        // Actualizar el contenido del diálogo
        setContentDialog(data);

        // Mostrar el diálogo de confirmación
        setOpenDialog(true);
      } catch (error) {
        toast.error(
          'Error al generar el comprobante de cementerio. Intente nuevamente.',
          { duration: 5000 }
        );
        console.log({ error });
      } finally {
        setIsOpen(false);
      }
    });
  };

  return (
    <>
      <Toaster />
      <Popover open={isOpen}>
        <PopoverTrigger asChild onClick={() => setIsOpen(true)}>
          <Button size='lg' variant='outline' className='flex gap-2'>
            <FileChartColumnIncreasing size={18} />
            Caja diaria
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          {/* Mostrar un mensaje de advertencia antes de realizar la acción */}
          <div className='flex flex-col gap-2'>
            <p className='text-sm text-gray-600'>
              Al generar el reporte de caja diaria se cerrará la caja actual.
              <br /> ¿Desea continuar?
            </p>

            <div className='flex gap-2 justify-end'>
              <Button
                size='sm'
                variant='outline'
                onClick={() => setIsOpen(false)}
              >
                No
              </Button>
              <Button
                size='sm'
                variant='default'
                onClick={handleClick}
                loading={isMutating}
              >
                Si
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};
