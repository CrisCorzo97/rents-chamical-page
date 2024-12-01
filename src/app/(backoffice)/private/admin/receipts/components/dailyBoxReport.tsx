'use client';

import { Button, Popover } from '@/components/ui';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { receipt } from '@prisma/client';
import { PopoverClose } from '@radix-ui/react-popover';
import { PDFViewer } from '@react-pdf/renderer';
import { FileChartColumnIncreasing } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast, Toaster } from 'sonner';
import { generateDailyBoxReport } from '../receipt-actions';
import { DailyBoxReportPDF } from './dailyBoxReportPDF';

export const DailyBoxReport = () => {
  const [isMutating, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [contentDialog, setContentDialog] = useState<{
    total_amount_collected: number;
    total_receipts: number;
    page_data: {
      page: number;
      subtotal: number;
      receipts: receipt[];
      total_items: number;
    }[];
  }>({
    total_amount_collected: 0,
    total_receipts: 0,
    page_data: [],
  });

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
      <Popover>
        <PopoverTrigger asChild>
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
              <PopoverClose asChild>
                <Button
                  size='sm'
                  variant='outline'
                  onClick={() => setIsOpen(false)}
                >
                  No
                </Button>
              </PopoverClose>
              <AlertDialog open={openDialog}>
                <AlertDialogTrigger asChild>
                  <Button
                    size='sm'
                    variant='default'
                    onClick={handleClick}
                    loading={isMutating}
                  >
                    Si
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className='flex flex-col min-h-[90vh] min-w-screen max-w-screen-2xl'>
                  <AlertDialogTitle>
                    Reporte de caja diaria generado
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    El reporte de caja diara ha sido generado con éxito. Puede
                    descargarlo a continuación.
                  </AlertDialogDescription>
                  <PDFViewer className='flex-1 h-[95%] w-[95%] m-auto'>
                    <DailyBoxReportPDF data={contentDialog} />
                  </PDFViewer>
                  <AlertDialogFooter className='flex-none'>
                    <AlertDialogAction onClick={() => setOpenDialog(false)}>
                      Continuar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};
