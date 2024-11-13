import { Button } from '@/components/ui';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Undo2 } from 'lucide-react';
import Link from 'next/link';
import { getCitySections, getNeighborhoods } from '../actions.property';
import { CreatePropertyRecordForm } from './page.client';

const CreatePropertyRecordPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    from_receipt: string;
  }>;
}) => {
  const neighborhoods = await getNeighborhoods();
  const citySections = await getCitySections();

  const fromReceipt = (await searchParams)?.from_receipt;

  return (
    <ScrollArea className='mx-6 h-admin-scroll-area'>
      <Breadcrumb className='h-12 mt-6'>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href='/' prefetch>
                Inicio
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Portal Administrativo</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href='/private/admin/property' prefetch>
                Inmueble
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Nuevo registro</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <article className='mb-10'>
        {/** Si existe la query fromReceipt renderizar un botón para volver atrás */}
        {fromReceipt && (
          <Button variant='outline' className='flex gap-2 border-primary mb-6'>
            <Undo2 size={18} className='text-primary' />
            <Link href='/private/admin/receipts/create-property-receipt'>
              Volver a la creación de comprobante
            </Link>
          </Button>
        )}
        <h1 className='text-2xl font-bold'>Crear nuevo registro de inmueble</h1>
        <p className='text-gray-500 mt-2'>
          Complete el formulario con los datos del nuevo registro de inmueble.
        </p>

        <CreatePropertyRecordForm
          citySections={citySections}
          neighborhoods={neighborhoods}
        />
      </article>
    </ScrollArea>
  );
};
export default CreatePropertyRecordPage;
