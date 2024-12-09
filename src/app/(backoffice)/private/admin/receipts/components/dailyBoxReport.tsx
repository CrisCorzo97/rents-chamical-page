'use client';

import { Button, Calendar, Label, Popover } from '@/components/ui';
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
import { CalendarIcon, FileChartColumnIncreasing } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';
import { toast, Toaster } from 'sonner';
import { generateDailyBoxReport } from '../receipt-actions';
import { DailyBoxReportPDF } from './dailyBoxReportPDF';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FormItem } from '@/components/ui/form';
import { cn } from '@/lib/cn';
import dayjs from 'dayjs';

export const DailyBoxReport = () => {
  const [isMutating, startTransition] = useTransition();
  const [dateToGenerate, setDateToGenerate] = useState<string>(dayjs().toISOString());
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

  useEffect(() => {
    console.log({contentDialog})
  }, [contentDialog]);

  const handleClick = () => {
    startTransition(async () => {
      try {
        const { data, error } = await generateDailyBoxReport(dateToGenerate);

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
      }
    });
  };

  return (
    <div>
      <Toaster />
      <Dialog>
        <DialogTrigger asChild>
          <Button size='lg' variant='outline' className='flex gap-2'>
            <FileChartColumnIncreasing size={18} />
            Caja diaria
          </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogTitle>Generar reporte de caja diaria</DialogTitle>
            <DialogDescription>{'Para generar el reporte de caja diaria, elija una fecha y después haga clic en el botón "Generar".'}</DialogDescription>


            <FormItem className='mb-4 mt-2'>
              <Label className='block'>Fecha del reporte</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-[280px] justify-start text-left font-normal',
                      !dateToGenerate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {dateToGenerate ? (
                      dayjs(dateToGenerate).format('DD/MM/YYYY')
                    ) : (
                      <span>Seleccione una fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0'>
                  <Calendar
                    mode='single'
                    selected={dayjs(dateToGenerate).toDate()}
                    onSelect={(date) =>
                      setDateToGenerate(dayjs(date).toISOString())
                    }
                    initialFocus
                    disabled={{after: dayjs().toDate()}}
                  />
                </PopoverContent>
              </Popover>
            </FormItem>

            <div className='flex gap-2 justify-end'>
              <DialogClose asChild>
                <Button
                  size='sm'
                  variant='outline'
                >
                  Cancelar
                </Button>
              </DialogClose>
              <AlertDialog open={openDialog}>
                <AlertDialogTrigger asChild>
                  <Button
                    size='sm'
                    variant='default'
                    onClick={handleClick}
                    loading={isMutating}
                  >
                    Generar
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
                    <DailyBoxReportPDF data={{...contentDialog, date: dateToGenerate}} />
                  </PDFViewer>
                  <AlertDialogFooter className='flex-none'>
                    <AlertDialogAction onClick={() => setOpenDialog(false)}>
                      Continuar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
