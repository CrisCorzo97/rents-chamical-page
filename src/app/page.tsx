import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { MainHeader } from './ui';
import { CreditCard, FileText, Info, User, Building } from 'lucide-react';
import { Button } from '@/components/ui';
import dayjs from 'dayjs';

export default async function Home() {
  return (
    <main className='min-h-screen flex flex-col'>
      <MainHeader />
      {/* Hero Section */}
      <section className='relative bg-[url("/banner.jpg")] bg-cover bg-center py-20 px-6'>
        <div className='absolute inset-0 bg-gradient-to-b from-zinc-950/80 to-zinc-600/60'></div>
        <div className='relative max-w-5xl mx-auto text-center'>
          <h1 className='text-4xl md:text-5xl font-bold mb-6 text-primary-foreground'>
            Te damos la bienvenida a Rentas Digital
          </h1>
          <p className='text-xl opacity-90 mb-8 max-w-3xl mx-auto text-primary-foreground'>
            Gestioná tus tributos municipales de forma rápida, segura y desde
            cualquier lugar
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link href='/resumen'>
              <Button size='lg' variant='outline'>
                Portal de Contribuyentes
              </Button>
            </Link>
            <Link href='/private/admin/receipts'>
              <Button size='lg' variant='outline'>
                Portal Administrativo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-16 px-6 bg-card'>
        <div className='max-w-6xl mx-auto'>
          <h2 className='text-3xl font-bold text-center mb-12'>
            ¿Qué puede hacer en nuestra plataforma?
          </h2>

          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {/* Feature 1 - DDJJ */}
            <Link href='/mis-declaraciones' prefetch>
              <Card className='h-full hover:shadow-md transition-all'>
                <CardContent className='p-6 flex flex-col items-center text-center'>
                  <div className='bg-pink-100 p-3 rounded-full mb-4'>
                    <FileText className='h-8 w-8 text-primary' />
                  </div>
                  <CardTitle className='text-xl font-semibold mb-2'>
                    Declaraciones Juradas
                  </CardTitle>
                  <CardDescription>
                    Presente y gestione sus declaraciones juradas de manera
                    simple y eficiente.
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            {/* Feature 2 - Oblea */}
            <Link href='/tramites/oblea/generar' prefetch>
              <Card className='h-full hover:shadow-md transition-all'>
                <CardContent className='p-6 flex flex-col items-center text-center'>
                  <div className='bg-pink-100 p-3 rounded-full mb-4'>
                    <Building className='h-8 w-8 text-primary' />
                  </div>
                  <CardTitle className='text-xl font-semibold mb-2'>
                    Oblea de Habilitación Comercial
                  </CardTitle>
                  <CardDescription>
                    Genere y descargue su oblea de habilitación comercial de
                    manera ágil.
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            {/* Feature 3 - Estado Impositivo */}
            <Link href='/tramites/consultas' prefetch>
              <Card className='h-full hover:shadow-md transition-all'>
                <CardContent className='p-6 flex flex-col items-center text-center'>
                  <div className='bg-pink-100 p-3 rounded-full mb-4'>
                    <FileText className='h-8 w-8 text-primary' />
                  </div>
                  <CardTitle className='text-xl font-semibold mb-2'>
                    Estado Impositivo
                  </CardTitle>
                  <CardDescription>
                    Verifique la situación fiscal de sus tasas y contribuciones
                    municipales de forma rápida y segura.
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            {/* Feature 4 - Historial de Pagos */}
            <Link href='/mis-pagos' prefetch>
              <Card className='h-full hover:shadow-md transition-all'>
                <CardContent className='p-6 flex flex-col items-center text-center'>
                  <div className='bg-pink-100 p-3 rounded-full mb-4'>
                    <CreditCard className='h-8 w-8 text-primary' />
                  </div>
                  <CardTitle className='text-xl font-semibold mb-2'>
                    Historial de Pagos
                  </CardTitle>
                  <CardDescription>
                    Acceda a un registro detallado de sus pagos realizados y
                    descargue los comprobantes correspondientes.
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            {/* Feature 5 - Fechas Importantes */}
            <Link href='/informacion/calendario' prefetch>
              <Card className='h-full hover:shadow-md transition-all'>
                <CardContent className='p-6 flex flex-col items-center text-center'>
                  <div className='bg-pink-100 p-3 rounded-full mb-4'>
                    <Info className='h-8 w-8 text-primary' />
                  </div>
                  <CardTitle className='text-xl font-semibold mb-2'>
                    Fechas Importantes
                  </CardTitle>
                  <CardDescription>
                    Consulte el calendario con los plazos relevantes para el
                    pago de tasas y contribuciones municipales.
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            {/* Feature 6 - Atención al Ciudadano */}
            <Link href='/centro-de-ayuda/contacto' prefetch>
              <Card className='h-full hover:shadow-md transition-all md:col-span-2 lg:col-span-1'>
                <CardContent className='p-6 flex flex-col items-center text-center'>
                  <div className='bg-pink-100 p-3 rounded-full mb-4'>
                    <User className='h-8 w-8 text-primary' />
                  </div>
                  <CardTitle className='text-xl font-semibold mb-2'>
                    Atención al Ciudadano
                  </CardTitle>
                  <CardDescription>
                    Brindamos información clara y precisa sobre tasas y trámites
                    disponibles para facilitar su gestión.
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      <footer className='bg-border py-8 px-6 mt-auto'>
        <div className='max-w-6xl mx-auto'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
            <div className='flex items-center gap-2'>
              <span className='font-semibold'>
                Municipalidad de Chamical © {dayjs().year()}
              </span>
            </div>
            <div className='flex gap-8'>
              {/* <Link
                href='/terms'
                className='text-muted-foreground hover:text-foreground transition'
              >
                Términos y Condiciones
              </Link>
              <Link
                href='/privacy'
                className='text-muted-foreground hover:text-foreground transition'
              >
                Política de Privacidad
              </Link> */}
              <Link
                href='/organismo/sobre-rentas'
                className='text-muted-foreground hover:text-foreground transition'
              >
                Sobre Nosotros
              </Link>
              <Link
                href='/centro-de-ayuda/contacto'
                className='text-muted-foreground hover:text-foreground transition'
              >
                Contacto
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
