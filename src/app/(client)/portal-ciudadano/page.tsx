import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

export default function CitizenPortalPage() {
  return (
    <>
      <Breadcrumb className='w-full h-12'>
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
            <BreadcrumbPage>Portal del ciudadano</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <section className='w-full mb-6 md:mb-8'>
        <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4'>
          Elige un Impuesto
        </h1>
        <p className='text-base md:text-lg text-gray-500 max-w-2xl'>
          ¿Por cuál de los siguientes impuestos deseas consultar?
        </p>
      </section>

      <section className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6'>
        <Card className='w-full'>
          <Link href='/portal-ciudadano/inmueble' prefetch>
            <CardContent className='p-4 flex flex-col gap-2 items-center'>
              <Image
                src='/user-key.png'
                alt='Inmueble'
                height={100}
                width={100}
                className='aspect-square rounded-md object-cover'
              />
              <CardTitle className='text-lg md:text-xl text-center text-gray-500 hover:text-primary transition-colors'>
                Inmueble
              </CardTitle>
            </CardContent>
          </Link>
        </Card>

        <Card className='w-full'>
          <Link href='/portal-ciudadano/cementerio' prefetch>
            <CardContent className='p-4 flex flex-col gap-2 items-center'>
              <Image
                src='/user-key.png'
                alt='Cementerio'
                height={100}
                width={100}
                className='aspect-square rounded-md object-cover'
              />
              <CardTitle className='text-lg md:text-xl text-center text-gray-500 hover:text-primary transition-colors'>
                Cementerio
              </CardTitle>
            </CardContent>
          </Link>
        </Card>
      </section>
    </>
  );
}
