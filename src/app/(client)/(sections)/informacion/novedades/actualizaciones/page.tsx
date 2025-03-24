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
          title='RG 3/2025 - Prórroga de vencimientos'
          date='Publicado el 21 de Marzo de 2025'
          description='Esta resolución general establece una prórroga de los vencimientos de las tasas municipales para el año 2025. Se establece un nuevo calendario de vencimientos para los contribuyentes de acuerdo a la actividad comercial y el monto de ventas declarado.'
          downloadLink='https://fjksfkvauwungomvrlhm.supabase.co/storage/v1/object/public/documents//RG%201_2025%20-%20Vencimientos.pdf'
        />
        <RegulatoryUpdatesCard
          title='Instructivo para confeccionar DDJJ Rentas Municipales'
          date='Publicado el 16 de Marzo de 2025'
          description='Este instructivo detalla los pasos a seguir para confeccionar la Declaración Jurada de Rentas Municipales. Se detallan los datos que deben ser completados por los contribuyentes y se establecen los plazos para su presentación.'
          downloadLink='https://fjksfkvauwungomvrlhm.supabase.co/storage/v1/object/public/documents//Instructivo%20para%20confeccionar%20DDJJ%20Rentas%20Municipales.pdf'
        />
        <RegulatoryUpdatesCard
          title='RG 1/2025 - Vencimientos'
          date='Publicado el 16 de Marzo de 2025'
          description='En esta resolución general se establecen los vencimientos para el año 2025 de las tasas municipales. Se establece un calendario de vencimientos para los contribuyentes de acuerdo a la actividad comercial y el monto de ventas declarado.'
          downloadLink='https://fjksfkvauwungomvrlhm.supabase.co/storage/v1/object/public/documents//RG%201_2025%20-%20Vencimientos.pdf'
        />
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
