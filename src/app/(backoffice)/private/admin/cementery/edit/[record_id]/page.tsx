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
import {
  getBurialTypes,
  getCementeryPlaces,
  getCementeryRecordById,
  getNeighborhoods,
} from '../../actions.cementery';
import { EditCementeryRecordForm } from './editForm';

export default async function EditRecordPage({
  params,
  searchParams,
}: {
  params: Promise<{
    record_id: string;
  }>;
  searchParams: Promise<{
    from_receipt: string;
  }>;
}) {
  const record = await getCementeryRecordById((await params).record_id);
  const neighborhoods = await getNeighborhoods();
  const burialTypes = await getBurialTypes();
  const cementeryPlaces = await getCementeryPlaces();

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
              <Link href='/private/admin/cementery' prefetch>
                Cementerio
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Editar registro</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <article className='mb-10'>
        {/** Si existe la query fromReceipt renderizar un botón para volver atrás */}
        {fromReceipt && (
          <Button variant='outline' className='flex gap-2 border-primary mb-6'>
            <Undo2 size={18} className='text-primary' />
            <Link href='/private/admin/receipts/create-cementery-receipt'>
              Volver a la creación de comprobante
            </Link>
          </Button>
        )}
        <h1 className='text-2xl font-bold'>Editar registro de cementerio</h1>
        <p className='text-gray-500 mt-2'>
          Revise los datos y realice los cambios necesarios.
        </p>

        <EditCementeryRecordForm
          record={record!}
          neighborhoods={neighborhoods}
          burialTypes={burialTypes}
          cementeryPlaces={cementeryPlaces}
        />
      </article>
    </ScrollArea>
  );
}
