import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';

export default function Functions() {
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
              <Link href='/organismo' prefetch>
                Organismo
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Funciones</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <section className='text-lg max-w-6xl mx-auto mb-8'>
        <h1 className='text-4xl font-semibold mb-4'>Funciones</h1>
        <p className='mb-4 font-light'>
          La Dirección de Rentas de Chamical tiene como propósito garantizar una
          gestión tributaria eficiente, orientada a satisfacer las necesidades
          de los ciudadanos y contribuir al desarrollo del municipio. Para
          lograrlo, desempeña una serie de funciones clave que abarcan desde la
          recaudación de recursos hasta la atención y el asesoramiento a los
          contribuyentes.
        </p>

        <h3 className='text-2xl font-semibold mt-16 mb-4'>
          Principales Funciones de la Dirección de Rentas
        </h3>
        <ol className='list-decimal list-inside'>
          <li className='mb-2 font-semibold'>
            <span className='text-xl'>Gestión y Recaudación de Tributos</span>
            <ul className='list-disc list-inside ml-8'>
              <li className='mb-2 font-light'>
                Administrar y recaudar las tasas y contribuciones municipales,
                como las tasas de inmuebles, cementerios y otros servicios.
              </li>
              <li className='mb-2 font-light'>
                Implementar métodos de cobro que sean accesibles y convenientes
                para los ciudadanos.
              </li>
            </ul>
          </li>
          <li className='mb-2 font-semibold'>
            <span className='text-xl'>Fiscalización y Control</span>
            <ul className='list-disc list-inside ml-8'>
              <li className='mb-2 font-light'>
                Supervisar el cumplimiento de las obligaciones tributarias.
              </li>
              <li className='mb-2 font-light'>
                Detectar y prevenir irregularidades en el pago de tasas y
                contribuciones.
              </li>
              <li className='mb-2 font-light'>
                Realizar auditorías periódicas para garantizar la transparencia
                en la gestión.
              </li>
            </ul>
          </li>
          <li className='mb-2 font-semibold'>
            <span className='text-xl'>Atención al Ciudadano</span>
            <ul className='list-disc list-inside ml-8'>
              <li className='mb-2 font-light'>
                Brindar información clara y precisa sobre las tasas y trámites
                disponibles.
              </li>
              <li className='mb-2 font-light'>
                Ofrecer canales de atención que faciliten la comunicación entre
                los ciudadanos y la Dirección de Rentas.
              </li>
            </ul>
          </li>
          <li className='mb-2 font-semibold'>
            <span className='text-xl'>Planificación y Modernización</span>
            <ul className='list-disc list-inside ml-8'>
              <li className='mb-2 font-light'>
                Desarrollar estrategias para optimizar los procesos internos.
              </li>
              <li className='mb-2 font-light'>
                Incorporar tecnologías innovadoras que permitan automatizar
                trámites y mejorar la experiencia de los contribuyentes.
              </li>
            </ul>
          </li>
          <li className='mb-2 font-semibold'>
            <span className='text-xl'>Educación Fiscal</span>
            <ul className='list-disc list-inside ml-8'>
              <li className='mb-2 font-light'>
                Promover una cultura de responsabilidad fiscal mediante campañas
                informativas.
              </li>
              <li className='mb-2 font-light'>
                Concientizar a los ciudadanos sobre la importancia del
                cumplimiento tributario para el desarrollo del municipio.
              </li>
            </ul>
          </li>
          <li className='mb-2 font-semibold'>
            <span className='text-xl'>Gestión de Información Fiscal</span>
            <ul className='list-disc list-inside ml-8'>
              <li className='mb-2 font-light'>
                Administrar la base de datos tributaria municipal, asegurando la
                integridad y confidencialidad de la información.
              </li>
              <li className='mb-2 font-light'>
                Generar reportes y estadísticas para una mejor toma de
                decisiones.
              </li>
            </ul>
          </li>
        </ol>

        <h3 className='text-2xl font-semibold mt-16 mb-4'>
          Compromiso con la Comunidad
        </h3>
        <p className='mb-2 font-light'>
          Cada una de estas funciones está orientada a garantizar una gestión
          eficiente y transparente, asegurando que los recursos recaudados se
          traduzcan en beneficios tangibles para la comunidad.
        </p>

        <h3 className='text-2xl font-semibold mt-16 mb-4'>
          Colaboración Interinstitucional
        </h3>
        <p className='mb-2 font-light'>
          La Dirección de Rentas trabaja en conjunto con otras áreas municipales
          para coordinar esfuerzos y garantizar el cumplimiento de los objetivos
          comunes, como el mejoramiento de los servicios públicos y el
          desarrollo de proyectos locales.
        </p>
      </section>
    </>
  );
}
