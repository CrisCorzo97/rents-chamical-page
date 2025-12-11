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
import { AxiosError } from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { toast, Toaster } from 'sonner';
import { z } from 'zod';
import { resetPassword } from '../auth-client.actions';

const formSchema = z.object({
  newPassword: z
    .string()
    .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
      message:
        'La contraseña debe tener al menos una letra mayúscula, una minúscula y un número',
    })
    .regex(/^\S*$/, {
      message: 'La contraseña no puede tener espacios en blanco',
    }),
  confirmPassword: z
    .string()
    .min(8, {
      message:
        'La confirmación de la contraseña debe tener al menos 8 caracteres',
    })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
      message:
        'La confirmación de la contraseña debe tener al menos una letra mayúscula, una minúscula y un número',
    })
    .regex(/^\S*$/, {
      message:
        'La confirmación de la contraseña no puede tener espacios en blanco',
    }),
});

export function TaxpayerPasswordRecoveryForm() {
  const [isLoading, startTransition] = useTransition();
  const [zodErrors, setZodErrors] = useState<z.ZodIssue[] | null>(null);
  const [isSuccessfulRequest, setIsSuccessfulRequest] =
    useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const handleAction = async (formData: FormData) => {
    startTransition(async () => {
      const parsedFormData = {
        newPassword: formData.get('newPassword') as string,
        confirmPassword: formData.get('confirmPassword') as string,
      };

      try {
        formSchema.parse(parsedFormData);

        if (parsedFormData.newPassword !== parsedFormData.confirmPassword) {
          throw new Error('Las contraseñas no coinciden');
        }

        const { error } = await resetPassword({
          newPassword: parsedFormData.newPassword,
        });

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
        } else if (error instanceof Error) {
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
          <CardTitle className='text-2xl'>Elige una nueva contraseña</CardTitle>
          <CardDescription>
            Ingresa tu nueva contraseña a continuación.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleAction}>
            <fieldset className='grid gap-6' disabled={isLoading}>
              <FormItem>
                <Label htmlFor='newPassword'>Nueva contraseña</Label>
                <div className='relative'>
                  <Input
                    name='newPassword'
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    onChange={() => {
                      zodErrors?.find(
                        (error) => error.path[0] === 'newPassword'
                      ) &&
                        setZodErrors((prev) => {
                          return (
                            prev?.filter(
                              (error) => error.path[0] !== 'newPassword'
                            ) ?? []
                          );
                        });
                    }}
                  />
                  <div
                    className='absolute right-2 top-2 cursor-pointer'
                    onClick={() => setShowNewPassword((prev) => !prev)}
                  >
                    {showNewPassword ? (
                      <EyeOff className='w-6 h-6 text-gray-600' />
                    ) : (
                      <Eye className='w-6 h-6 text-gray-600' />
                    )}
                  </div>
                </div>
                {zodErrors?.find(
                  (error) => error.path[0] === 'newPassword'
                ) && (
                  <div className='text-red-500 text-sm'>
                    {
                      zodErrors.find((error) => error.path[0] === 'newPassword')
                        ?.message
                    }
                  </div>
                )}
              </FormItem>
              <FormItem>
                <Label htmlFor='confirmPassword'>Confirmar contraseña</Label>
                <div className='relative'>
                  <Input
                    name='confirmPassword'
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    onChange={() => {
                      zodErrors?.find(
                        (error) => error.path[0] === 'confirmPassword'
                      ) &&
                        setZodErrors((prev) => {
                          return (
                            prev?.filter(
                              (error) => error.path[0] !== 'confirmPassword'
                            ) ?? []
                          );
                        });
                    }}
                  />
                  <div
                    className='absolute right-2 top-2 cursor-pointer'
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className='w-6 h-6 text-gray-600' />
                    ) : (
                      <Eye className='w-6 h-6 text-gray-600' />
                    )}
                  </div>
                </div>
                {zodErrors?.find(
                  (error) => error.path[0] === 'confirmPassword'
                ) && (
                  <div className='text-red-500 text-sm'>
                    {
                      zodErrors.find(
                        (error) => error.path[0] === 'confirmPassword'
                      )?.message
                    }
                  </div>
                )}
              </FormItem>
              <FormItem>
                <Button type='submit' className='w-full' loading={isLoading}>
                  Cambiar contraseña
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
              Tu contraseña ha sido actualizada correctamente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Link
              href='/auth/portal-contribuyente/ingresar?redirect_to=_resumen'
              replace
            >
              <Button>Iniciar sesión</Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
