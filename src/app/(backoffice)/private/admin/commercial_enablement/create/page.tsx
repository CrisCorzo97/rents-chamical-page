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
  getNeighborhoods,
} from '../actions.commercial_enablement';
import { CreateCommercialEnablementForm } from './page.client';

export default async function CreateCommercialEnablementPage() {
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
            <BreadcrumbPage>Nuevo registro</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <article className='mb-10'>
        <h1 className='text-2xl font-bold'>
          Crear nuevo registro de habilitación comercial
        </h1>
        <p className='text-gray-500 mt-2'>
          Complete el formulario con los datos del nuevo registro de
          habilitación comercial.
        </p>

        <CreateCommercialEnablementForm
          citySections={citySections}
          neighborhoods={neighborhoods}
          commercialActivities={commercialActivities}
        />
      </article>
    </ScrollArea>
  );
}
