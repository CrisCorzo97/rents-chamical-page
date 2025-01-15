import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';
import SearchPoperty from './components/searchPoperty';
import SearchCementery from './components/searchCementery';

interface TaxQueryProps {
  params: Promise<{
    tax_type: string;
  }>;
}

export default async function TaxQuery({ params }: TaxQueryProps) {
  const tax_type = (await params).tax_type;

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
            <BreadcrumbLink asChild>
              <Link href='/tramites' prefetch>
                Trámites
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href='/tramites/consultas' prefetch>
                Consultas
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {tax_type === 'inmueble' ? 'Inmueble' : 'Cementerio'}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <section className='max-w-6xl mx-auto mb-4'>
        <h1 className='text-4xl font-bold mb-4'>
          {tax_type === 'inmueble' ? 'Inmueble' : 'Cementerio'}
        </h1>
        <p className='text-lg max-w-2xl text-gray-500'>
          {`
          Para consultar información sobre el estado de tu
          tasa / contribución, por favor introduce tu ${
            tax_type === 'inmueble'
              ? 'nombre o matrícula catastral'
              : 'nombre o el del difunto'
          }.`}
        </p>
      </section>

      <section className='max-w-6xl mx-auto flex flex-col gap-4 flex-wrap'>
        {tax_type === 'inmueble' ? <SearchPoperty /> : <SearchCementery />}
      </section>
    </>
  );
}
