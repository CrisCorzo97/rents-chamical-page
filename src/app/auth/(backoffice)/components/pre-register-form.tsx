'use client';
import Link from 'next/link';
import { ChevronLeft, InfoIcon } from 'lucide-react';
import { useState, useTransition } from 'react';
import { z } from 'zod';
import { toast, Toaster } from 'sonner';
import {
  Alert,
  AlertDescription,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  FormItem,
  Input,
  Label,
  Button,
  SelectValue,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui';
import { formatCuilInput } from '@/lib/formatters';
import { requestRegistration } from '../auth-bo.actions';
import { role } from '@prisma/client';

const formSchema = z.object({
  first_name: z
    .string()
    .min(3, { message: 'El nombre debe tener al menos 3 caracteres' })
    .regex(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ]+$/, {
      message: 'El nombre solo puede contener letras',
    }),
  last_name: z
    .string()
    .min(3, { message: 'El apellido debe tener al menos 3 caracteres' })
    .regex(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ]+$/, {
      message: 'El apellido solo puede contener letras',
    }),
  email: z.string().email({ message: 'Correo electrónico inválido' }),
  cuil: z.string().regex(/^\d{2}-\d{8}-\d{1}$/, {
    message: 'El CUIL ingresado no es válido',
  }),
  role: z.string().min(1, { message: 'Debes seleccionar un rol' }),
});

interface PreRegisterFormProps {
  roles: role[];
}

export function PreRegisterForm({ roles }: PreRegisterFormProps) {
  const [isLoading, startTransition] = useTransition();
  const [zodErrors, setZodErrors] = useState<z.ZodIssue[] | null>(null);
  const [isSuccessfulRequest, setIsSuccessfulRequest] =
    useState<boolean>(false);
  const [cuil, setCuil] = useState<string>('');

  const handleAction = async (formData: FormData) => {
    startTransition(async () => {
      const parsedFormData = {
        first_name: formData.get('first_name') as string,
        last_name: formData.get('last_name') as string,
        email: formData.get('email') as string,
        cuil: formData.get('cuil') as string,
        role: formData.get('role') as string,
      };

      try {
        formSchema.parse(parsedFormData);

        const { error } = await requestRegistration(parsedFormData);

        if (error) {
          toast.error(error);
        } else {
          setIsSuccessfulRequest(true);
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
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
          <CardTitle className='text-2xl'>
            Solicitar acceso a una cuenta
          </CardTitle>
          <CardDescription>
            Ingresa tus datos a continuación para solicitar acceso a una cuenta
          </CardDescription>
          <Alert className='p-2 mt-4 bg-blue-50 border-blue-500 text-blue-600 border-l-4'>
            <InfoIcon className='w-5 h-5 text-blue-600' />
            <AlertDescription className='ml-2'>
              El acceso a una cuenta solo está permitido para personal
              autorizado por la Municipalidad.
            </AlertDescription>
          </Alert>
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
                <Label htmlFor='cuil'>CUIL</Label>
                <Input
                  name='cuil'
                  required
                  value={cuil}
                  onChange={(e) => {
                    setCuil(formatCuilInput(e.target.value));
                    zodErrors?.find((error) => error.path[0] === 'cuil') &&
                      setZodErrors((prev) => {
                        return (
                          prev?.filter((error) => error.path[0] !== 'cuil') ??
                          []
                        );
                      });
                  }}
                />
                {zodErrors?.find((error) => error.path[0] === 'cuil') && (
                  <div className='text-red-500 text-sm'>
                    {
                      zodErrors.find((error) => error.path[0] === 'cuil')
                        ?.message
                    }
                  </div>
                )}
              </FormItem>
              <FormItem>
                <Label htmlFor='role'>Rol</Label>
                <Select
                  name='role'
                  required
                  onValueChange={() => {
                    zodErrors?.find((error) => error.path[0] === 'role') &&
                      setZodErrors((prev) => {
                        return (
                          prev?.filter((error) => error.path[0] !== 'role') ??
                          []
                        );
                      });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Selecciona un rol' />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((rol) => (
                      <SelectItem key={rol.id} value={rol.id.toString()}>
                        {rol.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {zodErrors?.find((error) => error.path[0] === 'role') && (
                  <div className='text-red-500 text-sm'>
                    {
                      zodErrors.find((error) => error.path[0] === 'role')
                        ?.message
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
                  Enviar
                </Button>
              </FormItem>
            </fieldset>
          </form>
          <div className='mt-2 text-center text-sm'>
            Ya tengo una cuenta.{' '}
            <Link
              href='/auth/ingresar'
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
            <DialogTitle>¡Solicitud enviada con éxito!</DialogTitle>
            <DialogDescription>
              En las próximas 48 horas hábiles, recibirás un correo electrónico
              informando el estado de la misma.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsSuccessfulRequest(false)}
              className='mr-2'
            >
              Realizar otra solicitud
            </Button>
            <Link href='/' replace>
              <Button>Volver al inicio</Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
