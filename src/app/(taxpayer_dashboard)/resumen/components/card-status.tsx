'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BadgeCheck } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useTransition } from 'react';
import { Toaster } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui';
import CuitActivityForm from './cuit-activity-form';
import { getTaxpayerData } from '../../lib/get-taxpayer-data';
import { commercial_activity, commercial_enablement } from '@prisma/client';

export const CardStatusSkeleton = () => {
  return (
    <Card className='h-52 flex flex-col justify-between md:col-span-6 2xl:col-span-5'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle>Estado del Contribuyente</CardTitle>
        <BadgeCheck className='h-6 w-6 text-muted-foreground' />
      </CardHeader>
      <CardContent>
        <Skeleton className='h-8 w-1/2 bg-border' />
      </CardContent>
      <CardFooter>
        <Skeleton className='h-10 w-full bg-border' />
      </CardFooter>
    </Card>
  );
};

export const CardStatus = ({ canGenerate }: { canGenerate: boolean }) => {
  const [isSelectActivityDialogOpen, setIsSelectActivityDialogOpen] =
    useState(false);
  const [isSearching, startSearchingTransition] = useTransition();
  const [activities, setActivities] = useState<
    (commercial_enablement & {
      commercial_activity: commercial_activity | null;
    })[]
  >([]);

  const handleOpenSelectActivityDialog = () => {
    startSearchingTransition(async () => {
      const { commercial_enablements } = await getTaxpayerData();
      setActivities(commercial_enablements);
      setIsSelectActivityDialogOpen(true);
    });
  };

  // const handleGenerateOblea = () => {
  //   startTransition(async () => {
  //     try {
  //       const { data, error } = await generateOblea();

  //       if (error) {
  //         setErrorDetails(error);
  //         setDialogContent('message'); // Mostrar mensaje de error en el diálogo
  //         setIsDialogOpen(true);
  //       } else {
  //         setLicenseData(data);
  //         setDialogContent('pdf'); // Mostrar el PDF en el diálogo
  //         setIsDialogOpen(true);
  //       }
  //     } catch (error) {
  //       toast.error('Error al procesar la solicitud.');
  //     }
  //   });
  // };

  return (
    <section className='md:col-span-6 2xl:col-span-5'>
      <Toaster />
      <Card className='h-52 flex flex-col justify-between'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle>Estado del Contribuyente</CardTitle>
          <BadgeCheck className='h-6 w-6 text-muted-foreground' />
        </CardHeader>
        <CardContent className='flex items-center gap-2'>
          <div
            className={`h-3 w-3 rounded-full ${
              canGenerate ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span className='text-sm font-medium'>
            {canGenerate
              ? '¡Estás al día!'
              : 'Tienes pagos pendientes o en revisión.'}
          </span>
        </CardContent>
        <CardFooter>
          <Button
            className='w-full'
            disabled={!canGenerate}
            onClick={handleOpenSelectActivityDialog}
            loading={isSearching}
          >
            Generar Oblea
          </Button>
        </CardFooter>
      </Card>

      {/* Dialog para seleccionar la actividad */}
      <Dialog
        open={isSelectActivityDialogOpen}
        onOpenChange={setIsSelectActivityDialogOpen}
      >
        <DialogContent>
          <DialogTitle>Seleccionar Actividad</DialogTitle>
          <DialogDescription>
            Selecciona una actividad de la lista para continuar.
          </DialogDescription>
          <CuitActivityForm activities={activities} />
        </DialogContent>
      </Dialog>
    </section>
  );
};
