import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';

export default function Authorities() {
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
              <Link href='/organismo' prefetch>
                Organismo
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Autoridades</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <section className='text-lg max-w-6xl mx-auto mb-8'>
        <h1 className='text-4xl font-bold mb-4'>Autoridades</h1>
        <p className='max-w-2xl mb-4'>
          La Dirección de Rentas de la Municipalidad de Chamical está liderada
          por un equipo de profesionales comprometidos con la gestión
          transparente y eficiente de los recursos municipales. Las autoridades
          trabajan con un enfoque orientado al ciudadano, promoviendo la
          modernización de los procesos y garantizando el cumplimiento de las
          normativas fiscales.
        </p>

        <h3 className='text-2xl font-bold mt-8 mb-4'>
          Estructura de la Dirección de Rentas
        </h3>
        <p className='mb-2'>
          El organismo está organizado en distintas áreas que trabajan de manera
          coordinada para cumplir con sus funciones, entre ellas:
        </p>
        <ol className='list-decimal list-inside'>
          <li className='mb-2'>
            <span>Gestión de tasas y contribuciones.</span>
          </li>
          <li className='mb-2'>
            <span>Atención al ciudadano.</span>
          </li>
          <li className='mb-2'>
            <span>Fiscalización y control tributario.</span>
          </li>
          <li className='mb-2'>
            <span>Planificación y modernización.</span>
          </li>
        </ol>

        <h3 className='text-2xl font-bold mt-8 mb-4'>
          Dirección General de Rentas
        </h3>
        <p className='mb-2'>
          La Dirección General es el área responsable de supervisar y coordinar
          todas las actividades relacionadas con la gestión tributaria. Bajo el
          liderazgo del Director/a General, se toman decisiones estratégicas
          para garantizar el correcto funcionamiento de la entidad.
        </p>

        <h3 className='text-2xl font-bold mt-8 mb-4'>
          Datos del Director/a General del Área
        </h3>
        <p className='mb-2'>
          <b>Nombre completo:</b> [Nombre del director/a]
        </p>
        <p className='mb-2'>
          <b>Cargo:</b> Director/a General de Rentas
        </p>
        <p className='mb-2'>
          <b>Formación Académica:</b> [Título/s académico/s relevante/s]
        </p>
        <p className='mb-2'>
          <b>Experiencia Profesional:</b> [Breve descripción de la trayectoria
          laboral, destacando roles anteriores en gestión pública o privada]
        </p>
        <p className='mb-2'>
          <b>Objetivos en la Gestión:</b>
        </p>
        <ul className='list-disc list-inside'>
          <li className='mb-2'>
            <span>Modernizar los procesos tributarios.</span>
          </li>
          <li className='mb-2'>
            <span>
              Garantizar una relación transparente y accesible con los
              contribuyentes.
            </span>
          </li>
          <li className='mb-2'>
            <span>
              Implementar herramientas tecnológicas para optimizar los servicios
              de la Dirección.
            </span>
          </li>
        </ul>

        <h3 className='text-2xl font-bold mt-8 mb-4'>
          Mensaje del Director/a General
        </h3>
        <p className='mb-2'>
          <i>
            &quot;Es un honor liderar este equipo y trabajar al servicio de los
            ciudadanos de la Municipalidad de Chamical. Nuestro compromiso es
            garantizar que la Dirección de Rentas sea una institución modelo,
            ofreciendo servicios modernos, transparentes y orientados a las
            necesidades de nuestra comunidad.&quot;
          </i>
        </p>
      </section>
    </>
  );
}
