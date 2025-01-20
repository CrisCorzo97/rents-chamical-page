import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';

export default function HelpCenter() {
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
            <BreadcrumbPage>Centro de Ayuda</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <section className='text-lg max-w-6xl mx-auto mb-8'>
        <h1 className='text-4xl font-semibold mb-4'>Centro de Ayuda</h1>
        <p className='mb-4 font-light'>
          El Centro de Ayuda está diseñado para facilitar tu experiencia como
          contribuyente, ofreciéndote acceso rápido a herramientas de soporte y
          respuestas a las dudas más comunes. Explora nuestras subsecciones para
          encontrar soluciones y guías prácticas sobre el uso de la plataforma y
          los trámites disponibles.
        </p>

        <h3 className='text-2xl font-semibold mt-12 mb-4'>
          <Link
            href='/centro-de-ayuda/contacto'
            prefetch
            className='text-blue-500 hover:underline'
          >
            Contacto
          </Link>
        </h3>
        <p className='mb-4 font-light'>
          Encuentra los canales oficiales de comunicación para resolver tus
          consultas o solicitar información adicional. Nuestro equipo está
          disponible para ayudarte a través de distintos medios, como correo
          electrónico, teléfono y atención presencial.
        </p>

        <h3 className='text-2xl font-semibold mt-12 mb-4'>
          <Link
            href='/centro-de-ayuda/preguntas-frecuentes'
            prefetch
            className='text-blue-500 hover:underline'
          >
            Preguntas Frecuentes
          </Link>
        </h3>
        <p className='mb-4 font-light'>
          Accede a un listado de las inquietudes más habituales entre los
          contribuyentes, junto con respuestas claras y detalladas. Esta
          subsección está pensada para resolver rápidamente tus dudas sin
          necesidad de contactar con soporte.
        </p>

        <h3 className='text-2xl font-semibold mt-12 mb-4'>
          <Link
            href='/centro-de-ayuda/instructivos-tutoriales'
            prefetch
            className='text-blue-500 hover:underline'
          >
            Instructivos / Tutoriales
          </Link>
        </h3>
        <p className='mb-4 font-light'>
          Aprende paso a paso cómo realizar consultas, gestionar trámites o
          utilizar las herramientas del sistema a través de guías prácticas y
          tutoriales visuales. Todo está diseñado para hacer más sencilla tu
          experiencia con la plataforma.
        </p>

        <h3 className='text-2xl font-semibold mt-12 mb-4'>
          Beneficios de esta Sección
        </h3>
        <ul className='list-disc list-inside font-light'>
          <li className='mb-2'>
            <span>
              <b>Asistencia accesible:</b> Soluciones rápidas y efectivas para
              tus dudas.
            </span>
          </li>
          <li className='mb-2'>
            <span>
              <b>Autonomía:</b> Encuentra respuestas y guías sin necesidad de
              asistencia directa.
            </span>
          </li>
          <li className='mb-2'>
            <span>
              <b>Soporte integral:</b> Desde preguntas básicas hasta
              procedimientos detallados, todo en un solo lugar.
            </span>
          </li>
        </ul>
      </section>
    </>
  );
}
