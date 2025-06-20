'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PDFViewer } from '@react-pdf/renderer';
import CommercialLicense from './CommercialLicense';
import { generateOblea } from '../services/overview.action';
import { toast } from 'sonner';
import { commercial_activity, commercial_enablement } from '@prisma/client';
import { LicenseData } from '../../types/types';

interface CuitActivityFormProps {
  activities: (commercial_enablement & {
    commercial_activity: commercial_activity | null;
  })[];
}

export default function CuitActivityForm({
  activities,
}: CuitActivityFormProps) {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<'pdf' | 'message' | null>(
    null
  );
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [licenseData, setLicenseData] = useState<LicenseData | null>(null);
  const [isGenerating, startGeneratingTransition] = useTransition();

  const handleSubmit = () => {
    startGeneratingTransition(async () => {
      try {
        const { data, error } = await generateOblea({
          commercial_enablement_id: selectedActivity!,
        });

        if (error) {
          setErrorDetails(error);
          setDialogContent('message'); // Mostrar mensaje de error en el diálogo
          setIsDialogOpen(true);
        } else {
          setLicenseData(data);
          setDialogContent('pdf'); // Mostrar el PDF en el diálogo
          setIsDialogOpen(true);
        }
      } catch (err) {
        toast.error('Error al procesar la solicitud.');
      }
    });
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setDialogContent(null);
  };

  return (
    <>
      <div className='flex flex-col gap-4'>
        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='activity-select'>Actividad</Label>
            <Select
              onValueChange={setSelectedActivity}
              value={selectedActivity || ''}
            >
              <SelectTrigger id='activity-select'>
                <SelectValue placeholder='Selecciona una actividad' />
              </SelectTrigger>
              <SelectContent className='max-w-lg'>
                {activities.map((activity) => (
                  <SelectItem
                    key={activity.id}
                    value={activity.id}
                    className='text-ellipsis'
                  >
                    {activity.commercial_activity?.activity}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className='flex justify-end mt-4'>
          <Button
            onClick={handleSubmit}
            disabled={!selectedActivity}
            loading={isGenerating}
          >
            Generar Oblea
          </Button>
        </div>
      </div>

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
    </>
  );
}
