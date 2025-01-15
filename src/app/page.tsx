import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { MainHeader } from './ui';
import { ChevronRight, Info, KeyRound } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default async function Home() {
  return (
    <main className='min-h-screen flex flex-col'>
      <MainHeader />
      <section className='grow p-4 mb-8'>
        <div className='h-12' />

        <article className='max-w-6xl mx-auto mb-8'>
          <h1 className='text-4xl font-semibold pb-4'>
            ¡Bienvenido a la Dirección de Rentas Municipales!
          </h1>
          <p className='text-lg font-light pb-4'>
            Este sistema ha sido diseñado para ofrecerte información clara,
            precisa y accesible sobre tus trámites y contribuciones tributarias.
            Desde aquí, podrás explorar todas las opciones disponibles,
            consultar el estado de tus tasas y acceder a novedades importantes.
          </p>
          <p className='text-lg font-light pb-4'>
            Elige una de las siguientes opciones para comenzar:
          </p>

          <div className='mb-8 flex flex-wrap gap-4'>
            <Link href='/tramites/consultas' prefetch>
              <Card className='min-h-40 w-full max-w-md flex items-start cursor-pointer transition-all hover:text-primary'>
                <CardContent className='w-full p-4 py-4 flex gap-4 items-start'>
                  <div className='w-full flex flex-col justify-between gap-2 overflow-hidden '>
                    <CardTitle className='text-xl'>Consulta</CardTitle>
                    <CardDescription>
                      Verifica el estado impositivo de tus tasas y
                      contribuciones. Simplemente ingresa el identificador
                      correspondiente para acceder a la información de tus
                      obligaciones tributarias.
                    </CardDescription>
                  </div>
                  <ChevronRight className='w-8 h-8' />
                </CardContent>
              </Card>
            </Link>
            <Link href='/organismo/sobre-rentas' prefetch>
              <Card className='min-h-40 w-full max-w-md flex items-start cursor-pointer transition-all hover:text-primary'>
                <CardContent className='w-full p-4 py-4 flex gap-4 items-start'>
                  <div className='w-full flex flex-col justify-between gap-2 overflow-hidden '>
                    <CardTitle className='text-xl'>Sobre Rentas</CardTitle>
                    <CardDescription>
                      Aprende más sobre la Dirección de Rentas, incluyendo su
                      historia, visión, misión y funciones clave.
                    </CardDescription>
                  </div>
                  <ChevronRight className='w-8 h-8' />
                </CardContent>
              </Card>
            </Link>
            <Link href='/informacion/tasas-contribuciones' prefetch>
              <Card className='min-h-40 w-full max-w-md flex items-start cursor-pointer transition-all hover:text-primary'>
                <CardContent className='w-full p-4 py-4 flex gap-4 items-start'>
                  <div className='w-full flex flex-col justify-between gap-2 overflow-hidden '>
                    <CardTitle className='text-xl'>
                      Tasas y Contribuciones
                    </CardTitle>
                    <CardDescription>
                      Encuentra información detallada sobre las tasas
                      municipales y sus periodos de pago, así como las
                      normativas asociadas.
                    </CardDescription>
                  </div>
                  <ChevronRight className='w-8 h-8' />
                </CardContent>
              </Card>
            </Link>
            <Link href='/centro-de-ayuda/contacto' prefetch>
              <Card className='min-h-40 w-full max-w-md flex items-start cursor-pointer transition-all hover:text-primary'>
                <CardContent className='w-full p-4 py-4 flex gap-4 items-start'>
                  <div className='w-full flex flex-col justify-between gap-2 overflow-hidden '>
                    <CardTitle className='text-xl'>Contacto</CardTitle>
                    <CardDescription>
                      ¿Tienes preguntas o necesitas ayuda? Comunícate con
                      nosotros a través de los distintos canales disponibles o
                      consulta las respuestas a las preguntas frecuentes.
                    </CardDescription>
                  </div>
                  <ChevronRight className='w-8 h-8' />
                </CardContent>
              </Card>
            </Link>
          </div>

          <h3 className='text-2xl font-semibold pb-4'>Acceso Administrativo</h3>
          <Alert className='mb-8 w-full bg-blue-100 border-blue-500'>
            <Info className='w-4 h-4' />
            <AlertTitle>
              Zona Exclusiva para Usuarios Administrativos
            </AlertTitle>
            <AlertDescription>
              Este espacio está reservado para el personal autorizado de la
              Dirección de Rentas. Si eres un usuario administrativo, ingresa
              tus credenciales para acceder al sistema de backoffice.
            </AlertDescription>
          </Alert>

          <Link href='/auth/callback' prefetch={false}>
            <Card className='w-full max-w-md flex items-start cursor-pointer transition-all hover:text-primary'>
              <CardContent className='w-full p-4 py-4 flex gap-4 items-center justify-between'>
                <KeyRound className='w-12 h-12' />
                <div className='w-full flex gap-4'>
                  <CardTitle className='text-xl'>
                    Panel administrativo
                  </CardTitle>
                </div>
                <ChevronRight className='w-8 h-8' />
              </CardContent>
            </Card>
          </Link>
        </article>
      </section>
      {/* <footer className='w-full h-28 bg-slate-200 grow-0 mt-8' /> */}
    </main>
  );
}
