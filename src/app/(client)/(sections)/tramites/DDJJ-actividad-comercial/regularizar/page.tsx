import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Image from 'next/image';
import Link from 'next/link';

export default function Regularize() {
  return (
    <section className='text-lg max-w-6xl mx-auto mb-8'>
      <Breadcrumb className='max-w-6xl mx-auto h-20'>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href='/' prefetch>
                Inicio
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href='/tramites' prefetch>
                Trámites
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href='/tramites/DDJJ-actividad-comercial' prefetch>
                DDJJ Actividad Comercial
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Regularizar</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className='max-w-2xl mx-auto bg-white'>
        <CardHeader>
          <CardTitle className='text-center'>
            No encontramos su inscripción en el registro de Actividad Comercial
          </CardTitle>
          <CardDescription className='text-center text-lg'>
            Por favor pase por la oficina de Rentas Municipal para regularizar
            su situación.
          </CardDescription>
        </CardHeader>
        <CardContent className='flex items-center justify-center'>
          <Image
            src='/empty-state.jpg'
            alt='empty-state'
            width={220}
            height={220}
          />
        </CardContent>
        <CardFooter>
          <Link href='/auth/logout' className='mx-auto'>
            <Button size='lg' variant='secondary'>
              Volver al inicio
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </section>
  );
}
