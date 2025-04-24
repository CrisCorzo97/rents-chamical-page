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

export const GenerateObleaPageClient = () => {
  const [taxId, setTaxId] = useState<string>('');
  const [error, setError] = useState('');
  const [licenseData, setLicenseData] = useState(null);
  const [isLoading, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<'pdf' | 'message' | null>(
    null
  );

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      try {
        const cuit = formData.get('cuit');
        const response = await fetch(`/api/check-cuit?cuit=${cuit}`);
        const data = await response.json();

        if (data.status === 'approved') {
          setLicenseData(data.licenseData);
          setDialogContent('pdf'); // Mostrar el PDF en el diálogo
          setIsDialogOpen(true);
          toast.success('Oblea generada correctamente.');
        } else {
          setDialogContent('message'); // Mostrar mensaje de error en el diálogo
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
        <DialogContent className='flex flex-col min-h-[90vh] min-w-screen max-w-screen-2xl'>
          {dialogContent === 'pdf' && licenseData && (
            <>
              <DialogHeader>
                <DialogTitle>Oblea Generada</DialogTitle>
              </DialogHeader>
              <PDFViewer className='flex-1 h-[95%] w-[95%] m-auto'>
                <CommercialLicense licenseData={licenseData} />
              </PDFViewer>
              <DialogFooter>
                <Button onClick={closeDialog}>Cerrar</Button>
              </DialogFooter>
            </>
          )}
          {dialogContent === 'message' && (
            <>
              <DialogHeader>
                <DialogTitle>No se puede generar la oblea</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                El CUIT ingresado no está habilitado para generar una oblea. Por
                favor, verifica tu estado tributario.
              </DialogDescription>
              <DialogFooter>
                <Button onClick={closeDialog}>Cerrar</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
