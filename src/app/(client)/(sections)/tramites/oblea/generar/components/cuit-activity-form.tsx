'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronLeft } from 'lucide-react';
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
import {
  generateObleaV2,
  getCommercialEnablement,
  LicenseData,
} from '../../oblea.actions';
import { toast } from 'sonner';
import { commercial_activity, commercial_enablement } from '@prisma/client';
import Link from 'next/link';
import { formatCuilInput } from '@/lib/formatters';

export default function CuitActivityForm() {
  const [step, setStep] = useState(1);
  const [cuit, setCuit] = useState('');
  const [activities, setActivities] = useState<
    (commercial_enablement & {
      commercial_activity: commercial_activity | null;
    })[]
  >([]);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [isSearching, startSearchingTransition] = useTransition();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<'pdf' | 'message' | null>(
    null
  );
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [licenseData, setLicenseData] = useState<LicenseData | null>(null);
  const [isGenerating, startGeneratingTransition] = useTransition();

  const handleCuitSearch = async () => {
    startSearchingTransition(async () => {
      try {
        const { commercial_enablement } = await getCommercialEnablement({
          tax_id: cuit,
        });

        if (commercial_enablement.length === 0) {
          toast.error('No se encontraron actividades asociadas a este CUIT.');
          return;
        }

        setActivities(commercial_enablement);
        setStep(2);
      } catch (error) {
        toast.error('Error al buscar las actividades.');
      }
    });
  };

  const handleSubmit = () => {
    startGeneratingTransition(async () => {
      try {
        const { data, error } = await generateObleaV2({
          tax_id: cuit,
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
      <Card className='w-full max-w-md'>
        <CardHeader>
          <Link href='/' replace prefetch>
            <Button
              variant='ghost'
              className='flex items-center text-sm gap-2 px-2 -ml-2 mb-2'
              size='sm'
            >
              <ChevronLeft className='text-gray-600 h-5 w-5' />
              Inicio
            </Button>
          </Link>

          <CardTitle className='text-2xl'>
            {step === 1
              ? 'Paso 1: Ingresar CUIT'
              : 'Paso 2: Seleccionar Actividad'}
          </CardTitle>
          <CardDescription>
            {step === 1
              ? 'Ingresa el CUIT para buscar las actividades asociadas.'
              : 'Selecciona una actividad de la lista para continuar.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='cuit'>CUIT</Label>
                <Input
                  id='cuit'
                  placeholder='Ej: 20-12345678-9'
                  value={cuit}
                  onChange={(e) => setCuit(formatCuilInput(e.target.value))}
                  disabled={isSearching}
                />
              </div>
            </div>
          )}

          {step === 2 && (
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
          )}
        </CardContent>
        <CardFooter className='flex justify-between'>
          {step === 1 && (
            <Button
              onClick={handleCuitSearch}
              disabled={cuit.length !== 13}
              loading={isSearching}
            >
              Buscar Actividades
            </Button>
          )}
          {step === 2 && (
            <>
              <Button
                variant='outline'
                onClick={() => {
                  setStep(1);
                  setActivities([]);
                  setSelectedActivity(null);
                }}
              >
                Volver
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!selectedActivity}
                loading={isGenerating}
              >
                Generar Oblea
              </Button>
            </>
          )}
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
    </>
  );
}
