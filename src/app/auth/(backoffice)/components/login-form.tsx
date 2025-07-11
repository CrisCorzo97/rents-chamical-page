'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormItem } from '../../../../components/ui/form';
import { Alert, AlertDescription } from '../../../../components/ui/alert';
import { ChevronLeft, Eye, EyeOff, InfoIcon } from 'lucide-react';
import { useState, useTransition } from 'react';
import { z } from 'zod';
import { login } from '../auth-bo.actions';
import { toast, Toaster } from 'sonner';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  email: z.string().email({ message: 'Correo electrónico inválido' }),
  password: z
    .string()
    .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' }),
});

export function LoginForm({ redirect_to }: { redirect_to?: string }) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [zodErrors, setZodErrors] = useState<z.ZodIssue[] | null>(null);
  const [isLoading, startTransition] = useTransition();

  const { replace } = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleAction = async (formData: FormData) => {
    startTransition(async () => {
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      try {
        formSchema.parse({ email, password });

        const { error, data } = await login({
          email,
          password,
          redirect_to,
        });

        if (error) {
          throw new Error(error);
        }

        if (data) {
          replace(data.redirectUrl);
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          setZodErrors(error.errors);
        } else {
          toast.error('Ha ocurrido un error, por favor intente nuevamente.');
        }
      } finally {
        setPassword('');
      }
    });
  };

  return (
    <>
      <Toaster />
      <Card className='mx-auto max-w-sm'>
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
          <CardTitle className='text-2xl'>Iniciar Sesión</CardTitle>
          <CardDescription>
            Ingresa tu correo electrónico a continuación para iniciar sesión en
            tu cuenta
          </CardDescription>
          <Alert className='p-2 mt-4 bg-blue-50 border-blue-500 text-blue-600 border-l-4'>
            <InfoIcon className='w-5 h-5 text-blue-600' />
            <AlertDescription className='ml-2'>
              El acceso es solo para usuarios autorizados.
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
                <div className='flex items-center'>
                  <Label htmlFor='password'>Contraseña</Label>
                  <Link
                    href='/auth/solicitar-recupero-clave'
                    className='ml-auto inline-block text-sm underline transition-all hover:text-primary'
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <div className='relative'>
                  <Input
                    name='password'
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
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
                    onClick={togglePasswordVisibility}
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
                <Button type='submit' className='w-full' loading={isLoading}>
                  Iniciar Sesión
                </Button>
              </FormItem>
            </fieldset>
          </form>
          <div className='mt-4 text-center text-sm'>
            ¿No tienes una cuenta?{' '}
            <Link
              href='/auth/solicitar-alta'
              className='underline transition-all hover:text-primary'
            >
              Regístrate
            </Link>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
