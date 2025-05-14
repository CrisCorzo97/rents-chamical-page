'use client';

import { Button, Calendar, Label, Popover } from '@/components/ui';
import { CalendarIcon, FileChartColumnIncreasing } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast, Toaster } from 'sonner';
import { generateDailyBoxReport } from '../receipt-actions';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
  const [openCalendar, setOpenCalendar] = useState<boolean>(false);

  const handleClickAndOpenPreview = () => {
    startTransition(async () => {
      try {
        const { data: reportContent, error } = await generateDailyBoxReport(
          dateToGenerate
        );

        if (error || !reportContent) {
          toast.error(error || 'No se recibieron datos para el reporte.', {
            duration: 5000,
          });
          console.log({ error });
          return;
        }

        // Guardar datos en sessionStorage para la nueva pestaña
        const dataForPreview = {
          content: reportContent,
          date: dateToGenerate,
        };
        sessionStorage.setItem(
          'dailyBoxReportDataForPreview',
          JSON.stringify(dataForPreview)
        );

        // Abrir la nueva página en una nueva pestaña
        window.open('/private/admin/receipts/daily-box-preview', '_blank');

        setOpenDialog(false); // Cerrar el diálogo de selección de fecha
      } catch (error) {
        toast.error(
          'Error al generar el reporte de caja diaria. Intente nuevamente.',
          { duration: 5000 }
        );
        console.error('Error en handleClickAndOpenPreview:', error);
      }
    });
  };

  return (
    <div>
      <Toaster />
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <Button size='lg' variant='outline' className='flex gap-2'>
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
            <Button
              size='sm'
              variant='default'
              onClick={handleClickAndOpenPreview}
              disabled={isMutating}
            >
              {isMutating ? 'Generando...' : 'Generar'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
