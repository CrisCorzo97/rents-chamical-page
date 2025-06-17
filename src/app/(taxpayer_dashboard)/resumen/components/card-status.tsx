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
import { LicenseData } from '../../types/types';
import { generateOblea } from '../services/overview.action';
import { Toaster, toast } from 'sonner';
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogFooter,
  DialogDescription,
} from '@/components/ui';
import CommercialLicense from './CommercialLicense';
import { PDFViewer } from '@react-pdf/renderer';

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
  const [isGenerating, startTransition] = useTransition();
  const [licenseData, setLicenseData] = useState<LicenseData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<'pdf' | 'message' | null>(
    null
  );
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  const handleGenerateOblea = () => {
    startTransition(async () => {
      try {
        const { data, error } = await generateOblea();

        if (error) {
          setErrorDetails(error);
          setDialogContent('message'); // Mostrar mensaje de error en el diálogo
          setIsDialogOpen(true);
        } else {
          setLicenseData(data);
          setDialogContent('pdf'); // Mostrar el PDF en el diálogo
          setIsDialogOpen(true);
        }
      } catch (error) {
        toast.error('Error al procesar la solicitud.');
      }
    });
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setDialogContent(null);
  };

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
            onClick={handleGenerateOblea}
            loading={isGenerating}
          >
            {isGenerating ? 'Generando...' : 'Generar Oblea'}
          </Button>
        </CardFooter>
      </Card>

      {/* Dialog para mostrar el PDF o mensaje */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {dialogContent === 'pdf' && licenseData && (
          <DialogContent className='flex flex-col min-h-[90vh] min-w-screen max-w-screen-2xl'>
            <DialogHeader>
              <DialogTitle>Oblea Generada</DialogTitle>
            </DialogHeader>
            <PDFViewer className='flex-1 h-[95%] w-[95%] m-auto'>
              <CommercialLicense licenseData={licenseData} />
            </PDFViewer>
            <DialogFooter>
              <Button onClick={closeDialog}>Cerrar</Button>
            </DialogFooter>
          </DialogContent>
        )}
        {dialogContent === 'message' && errorDetails && (
          <DialogContent className='flex flex-col'>
            <DialogHeader>
              <DialogTitle>No se puede generar la oblea</DialogTitle>
            </DialogHeader>
            <DialogDescription className='mb-4'>
              {errorDetails}
            </DialogDescription>
            <DialogFooter>
              <Button onClick={closeDialog}>Cerrar</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
};
