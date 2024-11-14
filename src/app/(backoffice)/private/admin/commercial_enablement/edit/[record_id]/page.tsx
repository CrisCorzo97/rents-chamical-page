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
  getCitySections,
  getCommercialActivities,
  getCommercialEnablementById,
  getNeighborhoods,
} from '../../actions.commercial_enablement';
import { EditPropertyRecordForm } from './editForm';

export default async function EditRecordPage({
  params,
}: {
  params: Promise<{
    record_id: string;
  }>;
}) {
  const record = await getCommercialEnablementById((await params).record_id);
  const neighborhoods = await getNeighborhoods();
  const citySections = await getCitySections();
  const commercialActivities = await getCommercialActivities();

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
              <Link href='/private/admin/commercial_enablement' prefetch>
                Habilitación comercial
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
        <h1 className='text-2xl font-bold'>
          Editar registro de habilitación comercial
        </h1>
        <p className='text-gray-500 mt-2'>
          Revise los datos y realice los cambios necesarios.
        </p>

        <EditPropertyRecordForm
          record={record!}
          citySections={citySections}
          neighborhoods={neighborhoods}
          commercialActivities={commercialActivities}
        />
      </article>
    </ScrollArea>
  );
}
