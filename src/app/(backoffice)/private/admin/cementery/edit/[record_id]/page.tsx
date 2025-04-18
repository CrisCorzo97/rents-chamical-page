import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ScrollArea } from '@/components/ui/scroll-area';
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
}: {
  params: Promise<{
    record_id: string;
  }>;
}) {
  const record = await getCementeryRecordById((await params).record_id);
  const neighborhoods = await getNeighborhoods();
  const burialTypes = await getBurialTypes();
  const cementeryPlaces = await getCementeryPlaces();

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
