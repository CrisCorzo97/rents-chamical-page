'use client';
import Link from 'next/link';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react';
import { useState, useTransition } from 'react';
import { z } from 'zod';
import { toast, Toaster } from 'sonner';
import {
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
import { formatCuilInput } from '@/lib/formatters';
import { signup } from '../auth-client.actions';

const formSchema = z.object({
  first_name: z
    .string()
    .min(3, { message: 'El nombre debe tener al menos 3 caracteres' })
    .regex(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/, {
      message: 'El nombre solo puede contener letras y espacios',
    }),
  last_name: z
    .string()
    .min(3, { message: 'El apellido debe tener al menos 3 caracteres' })
    .regex(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ]+$/, {
      message: 'El apellido solo puede contener letras',
    }),
  email: z.string().email({ message: 'Correo electrónico inválido' }),
  tax_id: z.string().regex(/^\d{2}-\d{8}-\d{1}$/, {
    message: 'El CUIT ingresado no es válido',
  }),
  password: z
    .string()
    .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' }),
});

export function SignupForm() {
  const [isLoading, startTransition] = useTransition();
  const [zodErrors, setZodErrors] = useState<z.ZodIssue[] | null>(null);
  const [isSuccessfulRequest, setIsSuccessfulRequest] =
    useState<boolean>(false);
  const [taxId, setTaxId] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const handleAction = async (formData: FormData) => {
    startTransition(async () => {
      const parsedFormData = {
        first_name: formData.get('first_name') as string,
        last_name: formData.get('last_name') as string,
        email: formData.get('email') as string,
        tax_id: formData.get('tax_id') as string,
        password: formData.get('password') as string,
      };

      try {
        formSchema.parse(parsedFormData);

        const { error } = await signup(parsedFormData);

        if (error) {
          toast.error(
            error ?? 'Ha ocurrido un error, por favor intente nuevamente.'
          );
        } else {
          setIsSuccessfulRequest(true);
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          setTaxId('');
          setZodErrors(error.errors);
        } else {
          toast.error('Ha ocurrido un error, por favor intente nuevamente.');
        }
      }
    });
  };

  return (
    <>
      <Toaster />
      <Card className='mt-2 mx-auto max-w-sm md:max-w-lg'>
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
          <CardTitle className='text-2xl'>Crear una cuenta</CardTitle>
          <CardDescription>
            Regístrate para realizar trámites que requieren autenticación.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleAction}>
            <fieldset
              className='grid gap-6 md:grid-cols-2'
              disabled={isLoading}
            >
              <FormItem>
                <Label htmlFor='first_name'>Nombre</Label>
                <Input
                  name='first_name'
                  required
                  onChange={() => {
                    zodErrors?.find(
                      (error) => error.path[0] === 'first_name'
                    ) &&
                      setZodErrors((prev) => {
                        return (
                          prev?.filter(
                            (error) => error.path[0] !== 'first_name'
                          ) ?? []
                        );
                      });
                  }}
                />
                {zodErrors?.find((error) => error.path[0] === 'first_name') && (
                  <div className='text-red-500 text-sm'>
                    {
                      zodErrors.find((error) => error.path[0] === 'first_name')
                        ?.message
                    }
                  </div>
                )}
              </FormItem>
              <FormItem>
                <Label htmlFor='last_name'>Apellido</Label>
                <Input
                  name='last_name'
                  required
                  onChange={() => {
                    zodErrors?.find((error) => error.path[0] === 'last_name') &&
                      setZodErrors((prev) => {
                        return (
                          prev?.filter(
                            (error) => error.path[0] !== 'last_name'
                          ) ?? []
                        );
                      });
                  }}
                />
                {zodErrors?.find((error) => error.path[0] === 'last_name') && (
                  <div className='text-red-500 text-sm'>
                    {
                      zodErrors.find((error) => error.path[0] === 'last_name')
                        ?.message
                    }
                  </div>
                )}
              </FormItem>
              <FormItem>
                <Label htmlFor='email'>Correo Electrónico</Label>
                <Input
                  name='email'
                  type='email'
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
                <Label htmlFor='tax_id'>CUIL / CUIT</Label>
                <Input
                  name='tax_id'
                  required
                  value={taxId}
                  onChange={(e) => {
                    setTaxId(formatCuilInput(e.target.value));
                    zodErrors?.find((error) => error.path[0] === 'tax_id') &&
                      setZodErrors((prev) => {
                        return (
                          prev?.filter((error) => error.path[0] !== 'tax_id') ??
                          []
                        );
                      });
                  }}
                />
                {zodErrors?.find((error) => error.path[0] === 'tax_id') && (
                  <div className='text-red-500 text-sm'>
                    {
                      zodErrors.find((error) => error.path[0] === 'tax_id')
                        ?.message
                    }
                  </div>
                )}
              </FormItem>
              <FormItem>
                <Label htmlFor='password'>Contraseña</Label>
                <div className='relative'>
                  <Input
                    name='password'
                    type={showPassword ? 'text' : 'password'}
                    onChange={(e) => {
                      zodErrors?.find(
                        (error) => error.path[0] === 'password'
                      ) &&
                        setZodErrors((prev) => {
                          return (
                            prev?.filter(
                              (error) => error.path[0] !== 'password'
                            ) ?? []
                          );
                        });
                    }}
                    required
                    className='pr-10'
                  />
                  <div
                    className='absolute right-2 top-2 cursor-pointer'
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className='w-6 h-6 text-gray-600' />
                    ) : (
                      <Eye className='w-6 h-6 text-gray-600' />
                    )}
                  </div>
                </div>
                {zodErrors?.find((error) => error.path[0] === 'password') && (
                  <div className='text-red-500 text-sm'>
                    {
                      zodErrors.find((error) => error.path[0] === 'password')
                        ?.message
                    }
                  </div>
                )}
              </FormItem>
              <FormItem>
                <Label htmlFor='confirm_password'>Confirmar contraseña</Label>
                <div className='relative'>
                  <Input
                    name='confirm_password'
                    type={showConfirmPassword ? 'text' : 'password'}
                    onChange={(e) => {
                      zodErrors?.find(
                        (error) => error.path[0] === 'confirm_password'
                      ) &&
                        setZodErrors((prev) => {
                          return (
                            prev?.filter(
                              (error) => error.path[0] !== 'confirm_password'
                            ) ?? []
                          );
                        });
                    }}
                    required
                    className='pr-10'
                  />
                  <div
                    className='absolute right-2 top-2 cursor-pointer'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className='w-6 h-6 text-gray-600' />
                    ) : (
                      <Eye className='w-6 h-6 text-gray-600' />
                    )}
                  </div>
                </div>
                {zodErrors?.find(
                  (error) => error.path[0] === 'confirm_password'
                ) && (
                  <div className='text-red-500 text-sm'>
                    {
                      zodErrors.find(
                        (error) => error.path[0] === 'confirm_password'
                      )?.message
                    }
                  </div>
                )}
              </FormItem>
              <FormItem className='md:col-span-2 md:grid md:gap-6 md:grid-cols-6'>
                <Button
                  type='submit'
                  className='w-full md:col-span-4 md:col-start-2'
                  loading={isLoading}
                >
                  Registrarse
                </Button>
              </FormItem>
            </fieldset>
          </form>
          <div className='mt-2 text-center text-sm'>
            Ya tengo una cuenta.{' '}
            <Link
              href='/auth/portal-contribuyente/ingresar'
              className='underline transition-all hover:text-primary'
            >
              Ingresar
            </Link>
          </div>
        </CardContent>
      </Card>
      <Dialog open={isSuccessfulRequest} onOpenChange={setIsSuccessfulRequest}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='mb-2 text-2xl'>¡Falta poco!</DialogTitle>
            <DialogDescription className='text-base'>
              <span className='flex items-center gap-2 text-gray-800'>
                Te hemos enviado un correo electrónico con un link para
                verificar tu cuenta. Para finalizar tu registro, haz click en el
                link que te enviamos.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='mt-4'>
            <Link href='/' replace>
              <Button>Continuar</Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
