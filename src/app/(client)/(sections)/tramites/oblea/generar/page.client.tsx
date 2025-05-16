'use client';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormItem,
  Input,
  Label,
} from '@/components/ui';
import { formatCuilInput } from '@/lib/formatters';
import { PDFViewer } from '@react-pdf/renderer';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { toast, Toaster } from 'sonner';
import CommercialLicense from './CommercialLicense';
import { generateObleaV2, LicenseData } from '../oblea.actions';

export const GenerateObleaPageClient = () => {
  const [taxId, setTaxId] = useState<string>('');
  const [licenseData, setLicenseData] = useState<LicenseData | null>(null);
  const [isLoading, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<'pdf' | 'message' | null>(
    null
  );
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  const handleSubmit = () => {
    startTransition(async () => {
      try {
        const { data, error } = await generateObleaV2(taxId);

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
      <Toaster />
      <Card className='mx-auto max-w-sm'>
        <CardHeader>
          <Link href='/' passHref replace prefetch>
            <Button
              variant='ghost'
              className='flex items-center text-sm gap-2 px-2 -ml-2 mb-2'
              size='sm'
            >
              <ChevronLeft className='text-gray-600 h-5 w-5' />
              Inicio
            </Button>
          </Link>

          <CardTitle className='text-2xl'>Generar Oblea</CardTitle>
          <CardDescription>
            Ingresa tu número de CUIT para generar la oblea correspondiente a tu
            licencia comercial.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit}>
            <fieldset className='grid gap-6' disabled={isLoading}>
              <FormItem>
                <Label htmlFor='cuit'>CUIT</Label>
                <Input
                  name='cuit'
                  value={taxId}
                  onChange={(e) => setTaxId(formatCuilInput(e.target.value))}
                  placeholder='Ingrese su número de CUIT'
                  required
                />
              </FormItem>
              <FormItem>
                <Button
                  type='submit'
                  className='w-full'
                  loading={isLoading}
                  disabled={taxId.length < 13}
                >
                  Generar Oblea
                </Button>
              </FormItem>
            </fieldset>
          </form>
        </CardContent>
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
};
