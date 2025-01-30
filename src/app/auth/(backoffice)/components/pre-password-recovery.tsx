'use client';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { z } from 'zod';
import { toast, Toaster } from 'sonner';
import { AxiosError } from 'axios';
import {
  Alert,
  AlertDescription,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  FormItem,
  Input,
  Label,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui';
import { ChevronLeft, InfoIcon } from 'lucide-react';
import { requestPasswordRecovery } from '../auth-bo.actions';

const formSchema = z.object({
  email: z.string().email({ message: 'Correo electrónico inválido' }),
});

export function PrePasswordRecovery() {
  const [isLoading, startTransition] = useTransition();
  const [zodErrors, setZodErrors] = useState<z.ZodIssue[] | null>(null);
  const [isSuccessfulRequest, setIsSuccessfulRequest] =
    useState<boolean>(false);

  const handleAction = async (formData: FormData) => {
    startTransition(async () => {
      const parsedFormData = {
        email: formData.get('email') as string,
      };

      try {
        formSchema.parse(parsedFormData);

        const { error } = await requestPasswordRecovery(parsedFormData);

        if (error) {
          toast.error(error);
        } else {
          setIsSuccessfulRequest(true);
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          setZodErrors(error.errors);
        } else if (error instanceof AxiosError) {
          toast.error(error.message);
        } else {
          toast.error(
            'Ocurrió un error al intentar recuperar tu contraseña. Por favor, intenta nuevamente.'
          );
        }
      }
    });
  };

  return (
    <>
      <Toaster />
      <Card className='mt-16 mx-auto max-w-sm md:mt-0'>
        <CardHeader>
          <Link href='/auth/ingresar' passHref replace prefetch>
            <Button
              variant='ghost'
              className='flex items-center text-sm gap-2 px-2 -ml-2 mb-2'
              size='sm'
            >
              <ChevronLeft className='text-gray-600 h-5 w-5' />
              Volver
            </Button>
          </Link>
          <CardTitle className='text-2xl'>¿Olvidaste tu contraseña?</CardTitle>
          <CardDescription>
            Ingresa el email asociado a tu cuenta para recuperar tu contraseña.
          </CardDescription>
          <Alert className='p-2 mt-4 bg-blue-50 border-blue-500 text-blue-600 border-l-4'>
            <InfoIcon className='w-5 h-5 text-blue-600' />
            <AlertDescription className='ml-2'>
              Te enviaremos un email con instrucciones para recuperar tu
              contraseña.
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent>
          <form action={handleAction}>
            <fieldset className='grid gap-6' disabled={isLoading}>
              <FormItem>
                <Label htmlFor='email'>Correo Electrónico</Label>
                <Input
                  name='email'
                  type='email'
                  placeholder='m@example.com'
                  required
                  onChange={() => {
                    zodErrors?.find((error) => error.path[0] === 'email') &&
                      setZodErrors((prev) => {
                        return (
                          prev?.filter((error) => error.path[0] !== 'email') ??
                          []
                        );
                      });
                  }}
                />
                {zodErrors?.find((error) => error.path[0] === 'email') && (
                  <div className='text-red-500 text-sm'>
                    {
                      zodErrors.find((error) => error.path[0] === 'email')
                        ?.message
                    }
                  </div>
                )}
              </FormItem>
              <FormItem>
                <Button type='submit' className='w-full' loading={isLoading}>
                  Enviar mail de recuperación
                </Button>
              </FormItem>
            </fieldset>
          </form>
        </CardContent>
      </Card>
      <Dialog open={isSuccessfulRequest} onOpenChange={setIsSuccessfulRequest}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¡Listo!</DialogTitle>
            <DialogDescription>
              Te enviamos un email con instrucciones para recuperar tu
              contraseña.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Link href='/' replace>
              <Button>Volver al inicio</Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
