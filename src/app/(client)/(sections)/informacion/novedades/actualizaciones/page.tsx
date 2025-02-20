import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';
import RegulatoryUpdatesCard from './components/regulatoryUpdatesCard';

export default function RegulatoryUpdates() {
  return (
    <>
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
              <Link href='/informacion' prefetch>
                Información
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href='/informacion/novedades' prefetch>
                Novedades
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Actualizaciones Normativas</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <section className='text-lg max-w-6xl mx-auto mb-8'>
        <h1 className='text-4xl font-semibold mb-4'>
          Actualizaciones Normativas
        </h1>
        <p className='mb-4 font-light'>
          En esta sección encontrarás las últimas actualizaciones normativas
          relacionadas con la gestión tributaria municipal. Mantente informado
          sobre los cambios recientes en leyes, ordenanzas y resoluciones
          fiscales.
        </p>

        <RegulatoryUpdatesCard
          title='Ordenanza Nro 540 - de modificación del Código Tributario Municipal - DEM'
          date='Publicado el 16 de Enero de 2025'
          description='Esta ordenanza modifica el antigüo código tributario que data desde el año 2008, el cual nunca llegó a estar vigente dado a que estaba incompleto. Esta última modificación dará lugar a la regulación de la actividad comercial de los contribuyentes en base a sus ventas declaradas.'
          downloadLink='https://fjksfkvauwungomvrlhm.supabase.co/storage/v1/object/public/documents/ORDENANZA%20Nro%20540%20TRIBUTARIA%20IMPOSITIVA%202025%20v.final.pdf'
        />
      </section>
    </>
  );
}
