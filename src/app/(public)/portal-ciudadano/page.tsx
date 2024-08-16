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
      <Breadcrumb className='max-w-6xl mx-auto h-12'>
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

      <section className='max-w-6xl mx-auto mb-8'>
        <h1 className='text-4xl font-bold mb-4'>Elige un Impuesto</h1>
        <p className='text-lg text-gray-500 max-w-2xl'>
          ¿Por cuál de los siguientes impuestos deseas consultar?
        </p>
      </section>

      <section className='max-w-6xl mx-auto flex gap-4 flex-wrap'>
        <Card className='w-[200px]'>
          <Link href='/portal-ciudadano/inmueble' prefetch>
            <CardContent className='p-4 flex flex-col gap-2 items-center'>
              <Image
                src='/user-key.png'
                alt='Inmueble'
                height={100}
                width={100}
                className='aspect-square rounded-md object-cover'
              />
              <CardTitle className='text-xl text-center text-gray-500 hover:text-primary'>
                Inmueble
              </CardTitle>
            </CardContent>
          </Link>
        </Card>

        <Card className='w-[200px]'>
          <Link href='/portal-ciudadano/cementerio' prefetch>
            <CardContent className='p-4 flex flex-col gap-2 items-center'>
              <Image
                src='/user-key.png'
                alt='Cementerio'
                height={100}
                width={100}
                className='aspect-square rounded-md object-cover'
              />
              <CardTitle className='text-xl text-center text-gray-500 hover:text-primary'>
                Cementerio
              </CardTitle>
            </CardContent>
          </Link>
        </Card>
      </section>
    </>
  );
}
