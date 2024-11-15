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
  getNeighborhoods,
} from '../actions.cementery';
import { CreateCementeryRecordForm } from './page.client';

const CreatePropertyRecordPage = async () => {
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
            <BreadcrumbPage>Nuevo registro</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <article className='mb-10'>
        <h1 className='text-2xl font-bold'>
          Crear nuevo registro de cementerio
        </h1>
        <p className='text-gray-500 mt-2'>
          Complete el formulario con los datos del nuevo registro de cementerio.
        </p>

        <CreateCementeryRecordForm
          burialTypes={burialTypes}
          neighborhoods={neighborhoods}
          cementeryPlaces={cementeryPlaces}
        />
      </article>
    </ScrollArea>
  );
};
export default CreatePropertyRecordPage;
