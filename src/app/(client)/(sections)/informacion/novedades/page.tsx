import { Button } from '@/components/ui';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';

export default function News() {
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
            <BreadcrumbPage>Novedades</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <section className='text-lg max-w-6xl mx-auto mb-8'>
        <h1 className='text-4xl font-semibold mb-4'>Novedades</h1>
        <p className='mb-4 font-light'>
          La sección de Novedades de la Dirección de Rentas tiene como objetivo
          mantener informados a los ciudadanos sobre los cambios,
          actualizaciones y eventos relacionados con la gestión tributaria
          municipal. Este espacio es un punto de referencia para conocer las
          noticias más relevantes, promoviendo una comunicación efectiva y
          transparente entre la administración y los contribuyentes.
        </p>

        <h3 className='text-2xl font-semibold mt-12 mb-4'>
          ¿Qué encontrarás en esta sección?
        </h3>

        <h4 className='text-xl font-semibold mt-8 mb-4'>
          Actualizaciones Normativas:
        </h4>
        <ul className='list-disc list-inside font-light'>
          <li className='mb-2'>
            <span>
              Cambios recientes en leyes, ordenanzas y resoluciones fiscales.
            </span>
          </li>
          <li className='mb-2'>
            <span>
              Implementación de nuevos decretos que impactan las tasas y
              contribuciones municipales.
            </span>
          </li>
        </ul>

        <Button className='bg-blue-500 my-2'>
          <Link href='/informacion/novedades/actualizaciones'>
            Ver las últimas actualizaciones
          </Link>
        </Button>

        <h4 className='text-xl font-semibold mt-8 mb-4'>
          Calendario Tributario:
        </h4>
        <ul className='list-disc list-inside font-light'>
          <li className='mb-2'>
            <span>
              Fechas importantes de vencimientos de tasas y contribuciones.
            </span>
          </li>
          <li className='mb-2'>
            <span>
              Información sobre prórrogas o modificaciones en los plazos de
              pago.
            </span>
          </li>
        </ul>

        <h4 className='text-xl font-semibold mt-8 mb-4'>
          Programas y Beneficios:
        </h4>
        <ul className='list-disc list-inside font-light'>
          <li className='mb-2'>
            <span>Anuncios de planes de regularización de deudas.</span>
          </li>
          <li className='mb-2'>
            <span>
              Bonificaciones y descuentos para contribuyentes cumplidores.
            </span>
          </li>
        </ul>

        <h4 className='text-xl font-semibold mt-8 mb-4'>
          Obras y Proyectos Financiados con Aportes Municipales:
        </h4>
        <ul className='list-disc list-inside font-light'>
          <li className='mb-2'>
            <span>
              Detalles sobre obras públicas realizadas gracias a los ingresos
              tributarios.
            </span>
          </li>
          <li className='mb-2'>
            <span>
              Ejemplos de proyectos en curso, como pavimentación, alumbrado o
              ampliación de redes.
            </span>
          </li>
        </ul>

        <h4 className='text-xl font-semibold mt-8 mb-4'>
          Eventos de Interés Ciudadano:
        </h4>
        <ul className='list-disc list-inside font-light'>
          <li className='mb-2'>
            <span>Charlas o talleres educativos sobre temas fiscales.</span>
          </li>
          <li className='mb-2'>
            <span>
              Jornadas de atención especial para resolver dudas o gestionar
              trámites.
            </span>
          </li>
        </ul>

        <h3 className='text-2xl font-semibold mt-12 mb-4'>
          ¿Por qué es importante esta sección?
        </h3>
        <p className='mb-4 font-light'>
          La sección de Novedades permite que los ciudadanos:
        </p>
        <ul className='list-disc list-inside font-light'>
          <li className='mb-2'>
            <span>
              Estén al tanto de las decisiones municipales que afectan sus
              obligaciones tributarias.
            </span>
          </li>
          <li className='mb-2'>
            <span>
              Planifiquen con anticipación el cumplimiento de sus
              responsabilidades fiscales.
            </span>
          </li>
          <li className='mb-2'>
            <span>
              Conozcan el impacto positivo de su aporte en el desarrollo de la
              comunidad.
            </span>
          </li>
        </ul>

        <h3 className='text-2xl font-semibold mt-12 mb-4'>
          Transparencia en la Comunicación
        </h3>
        <p className='mb-12 font-light'>
          La Dirección de Rentas se compromete a mantener un canal de
          comunicación abierto y actualizado, brindando a los ciudadanos
          información confiable y oportuna.
        </p>
      </section>
    </>
  );
}
