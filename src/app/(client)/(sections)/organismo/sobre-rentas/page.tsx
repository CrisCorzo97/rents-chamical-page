import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';

export default function About() {
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
            <BreadcrumbPage>Sobre Rentas</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <section className='text-lg max-w-6xl mx-auto mb-8'>
        <h1 className='text-4xl font-bold mb-4'>Sobre Rentas</h1>
        <p className='max-w-2xl mb-4'>
          La Dirección de Rentas de la Municipalidad de Chamical es el organismo
          responsable de gestionar las obligaciones tributarias municipales. Su
          objetivo principal es garantizar una administración eficiente,
          transparente y moderna de los recursos, para promover el desarrollo de
          nuestra comunidad.
        </p>
        <p className='max-w-2xl'>
          Desde la Dirección de Rentas, nos enfocamos en proporcionar servicios
          accesibles y prácticos para los ciudadanos, adaptándonos a las nuevas
          tecnologías y respondiendo a las necesidades de los contribuyentes.
        </p>

        <h3 className='text-2xl font-bold mt-8 mb-4'>
          ¿Qué es la Dirección de Rentas?
        </h3>
        <p className='mb-2'>
          Es una entidad pública encargada de administrar las tasas y
          contribuciones que los ciudadanos deben abonar para financiar
          servicios esenciales en el municipio, como:
        </p>

        <ul className='list-disc list-inside font-normal'>
          <li className='my-2'>
            <span>La recolección de residuos.</span>
          </li>
          <li className='mb-2'>
            <span>El mantenimiento de espacios públicos.</span>
          </li>
          <li className='mb-2'>
            <span>La gestión de cementerios municipales.</span>
          </li>
          <li className='mb-2'>
            <span>El alumbrado y otros servicios básicos.</span>
          </li>
        </ul>

        <h3 className='text-2xl font-bold mt-8 mb-4'>
          ¿Por qué es importante cumplir con las obligaciones tributarias?
        </h3>
        <p className='mb-2'>
          El pago de las tasas municipales permite al municipio contar con los
          recursos necesarios para:
        </p>
        <ul className='list-disc list-inside'>
          <li className='mb-2'>
            <span>Mejorar la calidad de vida de los ciudadanos.</span>
          </li>
          <li className='mb-2'>
            <span>Garantizar servicios públicos eficientes y sostenibles.</span>
          </li>
          <li className='mb-2'>
            <span>Fomentar el desarrollo urbano y rural.</span>
          </li>
        </ul>

        <h3 className='text-2xl font-bold mt-8 mb-4'>
          Compromiso con los Ciudadanos
        </h3>
        <p className='mb-2'>
          En la Municipalidad de Chamical, estamos comprometidos con una gestión
          que prioriza:
        </p>
        <ol className='list-decimal list-inside'>
          <li className='mb-2 font-bold'>
            <span className='font-normal'>
              <b>Transparencia:</b> Hacemos pública y accesible la información
              sobre las tasas y contribuciones.
            </span>
          </li>
          <li className='mb-2 font-bold'>
            <span className='font-normal'>
              <b>Accesibilidad:</b> Proveemos herramientas y servicios para
              facilitar la consulta de obligaciones tributarias.
            </span>
          </li>
          <li className='mb-2 font-bold'>
            <span className='font-normal'>
              <b>Eficiencia:</b> Buscamos optimizar los procesos de gestión
              tributaria para ofrecer un servicio rápido y confiable.
            </span>
          </li>
          <li className='mb-2 font-bold'>
            <span className='font-normal'>
              <b>Innovación:</b> Incorporamos tecnología para simplificar los
              trámites y garantizar una experiencia más ágil y moderna.
            </span>
          </li>
        </ol>

        <h3 className='text-2xl font-bold mt-8 mb-4'>Servicios de Rentas</h3>
        <p className='mb-2'>
          En esta primera etapa, la Dirección de Rentas ofrece:
        </p>
        <ul className='list-disc list-inside'>
          <li className='mb-2'>
            <span>Información detallada sobre las tasas municipales.</span>
          </li>
          <li className='mb-2'>
            <span>
              Consulta de estado impositivo para tasas como <i>inmuebles</i> o{' '}
              <i>cementerio</i>.
            </span>
          </li>
          <li className='mb-2'>
            <span>Información general sobre trámites y requisitos.</span>
          </li>
        </ul>
        <p className='mb-2'>
          La Dirección de Rentas no solo trabaja en la recaudación, sino que
          también tiene la misión de asesorar y acompañar a los ciudadanos en el
          cumplimiento de sus obligaciones tributarias.
        </p>
        <p className='mb-2'>
          Para más detalles, te invitamos a explorar las demás secciones del
          sitio o comunicarte con nuestro equipo de atención ciudadana a través
          del{' '}
          <b>
            <Link href='/centro-de-ayuda' className='underline text-blue-600'>
              Centro de Ayuda
            </Link>
          </b>
          .
        </p>
      </section>
    </>
  );
}
