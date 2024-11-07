import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { unstable_noStore } from 'next/cache';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { MainHeader } from './ui';

export default async function Home() {
  unstable_noStore();

  const cookieStore = cookies();
  const supabase = createSupabaseServerClient(cookieStore);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  const isAuthed = !error && !!user;

  return (
    <main className='min-h-screen flex flex-col'>
      <MainHeader />
      <section className='grow p-4'>
        <div className='h-12' />

        <section className='max-w-6xl mx-auto mb-8'>
          <h1 className='text-4xl font-bold pb-4'>
            ¡Bienvenido a Rentas Digital!
          </h1>
          <p className='text-lg text-gray-500 pb-4 max-w-2xl'>
            Rentas Digital es una plataforma que te permite realizar trámites
            relacionados con la Dirección General de Rentas de la Municipalidad
            de Chamical de manera rápida y sencilla.
          </p>
          <p className='text-lg text-gray-500 pb-4 max-w-2xl'>
            Desde Rentas Digital podrás realizar trámites como la impresión de
            la boleta de pago de tus impuestos, la consulta de deudas, la
            generación de certificados de libre deuda y la realización de pagos
            en línea. ¡Todo desde la comodidad de tu hogar!
          </p>
          <p className='text-lg text-gray-500'>
            Para comenzar, selecciona una de las siguientes opciones:
          </p>
        </section>

        <section className='flex gap-4 flex-wrap max-w-6xl mx-auto items-center'>
          <Card className='w-[250px]'>
            <Link href={isAuthed ? '/private/admin/receipts' : 'auth/ingresar'}>
              <CardContent className='p-4 py-8 flex flex-col gap-2 items-center'>
                <Image
                  src='/user-key.png'
                  alt='Acceso con clave'
                  height={100}
                  width={100}
                  className='aspect-square rounded-md object-cover'
                />
                <CardTitle className='px-4 text-xl text-gray-500 text-center hover:text-primary'>
                  Portal de administración
                </CardTitle>
              </CardContent>
            </Link>
          </Card>
          <Card className='w-[250px]'>
            <Link href='/portal-ciudadano' prefetch>
              <CardContent className='p-4 py-8 flex flex-col gap-2 items-center'>
                <Image
                  src='/user.png'
                  alt='Acceso sin clave'
                  height={100}
                  width={100}
                  className='aspect-square rounded-md object-cover'
                />
                <CardTitle className='px-4 text-xl text-gray-500 text-center hover:text-primary'>
                  Portal del ciudadano
                </CardTitle>
              </CardContent>
            </Link>
          </Card>
        </section>
      </section>
      <footer className='w-full h-28 bg-slate-200 grow-0 mt-8' />
    </main>
  );
}
