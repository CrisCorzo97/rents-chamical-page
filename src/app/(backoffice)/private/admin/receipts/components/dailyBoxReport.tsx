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
import { PDFViewer } from '@react-pdf/renderer';
import { CalendarIcon, FileChartColumnIncreasing } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast, Toaster } from 'sonner';
import { generateDailyBoxReport } from '../receipt-actions';
import { DailyBoxReportPDF } from './dailyBoxReportPDF';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FormItem } from '@/components/ui/form';
import { cn } from '@/lib/cn';
import dayjs from 'dayjs';

export type DailyBoxContent = {
  total_amount_collected: number;
  total_receipts: number;
  tax_summary: {
    add_new_page: boolean;
    details: Record<string, number>;
  };
  page_data: {
    page: number;
    subtotal: number;
    receipts: {
      id: string;
      paid_at: Date;
      taxpayer: string;
      tax_type: string;
      amount: number;
    }[];
    total_items: number;
  }[];
};

export const DailyBoxReport = () => {
  const [isMutating, startTransition] = useTransition();
  const [dateToGenerate, setDateToGenerate] = useState<string>(
    dayjs().toISOString()
  );
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openPreview, setOpenPreview] = useState<boolean>(false);
  const [openCalendar, setOpenCalendar] = useState<boolean>(false);
  const [contentDialog, setContentDialog] = useState<DailyBoxContent>({
    total_amount_collected: 0,
    total_receipts: 0,
    tax_summary: {
      add_new_page: false,
      details: {},
    },
    page_data: [],
  });

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
        setOpenPreview(true);
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
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <Button
            size='lg'
            variant='outline'
            className='flex gap-2'
            onClick={() => setOpenDialog(true)}
          >
            <FileChartColumnIncreasing size={18} />
            Caja diaria
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Generar reporte de caja diaria</DialogTitle>
          <DialogDescription>
            {
              'Para generar el reporte de caja diaria, elija una fecha y después haga clic en el botón "Generar".'
            }
          </DialogDescription>

          <FormItem className='mb-4 mt-2'>
            <Label className='block'>Fecha del reporte</Label>
            <Popover
              open={openCalendar}
              onOpenChange={setOpenCalendar}
              modal={true}
            >
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
                  onSelect={(date) => {
                    if (date) {
                      setDateToGenerate(dayjs(date).toISOString());
                    }
                    setOpenCalendar(false);
                  }}
                  initialFocus
                  disabled={{ after: dayjs().toDate() }}
                />
              </PopoverContent>
            </Popover>
          </FormItem>

          <div className='flex gap-2 justify-end'>
            <DialogClose asChild>
              <Button size='sm' variant='outline'>
                Cancelar
              </Button>
            </DialogClose>
            <AlertDialog open={openPreview} onOpenChange={setOpenPreview}>
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
                  <DailyBoxReportPDF
                    data={{ ...contentDialog, date: dateToGenerate }}
                  />
                </PDFViewer>
                <AlertDialogFooter className='flex-none'>
                  <AlertDialogAction onClick={() => setOpenPreview(false)}>
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
