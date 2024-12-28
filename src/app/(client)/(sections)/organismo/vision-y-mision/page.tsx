import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';

export default function VisionAndMision() {
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
            <BreadcrumbPage>Misión y Visión</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <section className='text-lg max-w-6xl mx-auto mb-8'>
        <h1 className='text-4xl font-bold mb-4'>Misión y Visión</h1>
        <h3 className='text-2xl font-bold mt-8 mb-4'>Nuestra Visión</h3>
        <p className='max-w-2xl mb-4'>
          Ser una institución modelo en la gestión tributaria municipal,
          destacada por su eficiencia, transparencia e innovación. Aspiramos a
          construir una relación de confianza con los ciudadanos, promoviendo la
          responsabilidad fiscal como un pilar para el desarrollo sostenible de
          nuestra comunidad.
        </p>

        <h3 className='text-2xl font-bold mt-8 mb-4'>Nuestra Misión</h3>
        <p className='max-w-2xl mb-4'>
          Proveer servicios tributarios accesibles y efectivos para los
          ciudadanos de Chamical. Nuestro objetivo es facilitar el cumplimiento
          de las obligaciones fiscales, optimizando los procesos de recaudación
          y garantizando el uso eficiente de los recursos para mejorar la
          calidad de vida de todos los habitantes.
        </p>

        <h3 className='text-2xl font-bold mt-8 mb-4'>Valores que nos guían</h3>
        <ul className='list-disc list-inside'>
          <li className='mb-2'>
            <span>
              <b>Transparencia:</b> Actuar con claridad y honestidad en la
              gestión de los recursos municipales.
            </span>
          </li>
          <li className='mb-2'>
            <span>
              <b>Innovación:</b> Incorporar tecnologías y procesos modernos para
              mejorar los servicios tributarios.
            </span>
          </li>
          <li className='mb-2'>
            <span>
              <b>Eficiencia:</b> Optimizar los recursos disponibles para lograr
              resultados efectivos.
            </span>
          </li>
          <li className='mb-2'>
            <span>
              <b>Compromiso:</b> Trabajar con dedicación para cumplir con las
              necesidades de los ciudadanos.
            </span>
          </li>
          <li className='mb-2'>
            <span>
              <b>Responsabilidad:</b> Garantizar el correcto manejo y aplicación
              de los fondos recaudados.
            </span>
          </li>
        </ul>

        <h3 className='text-2xl font-bold mt-8 mb-4'>Objetivos Estratégicos</h3>
        <p className='mb-2'>
          La Dirección General es el área responsable de supervisar y coordinar
          todas las actividades relacionadas con la gestión tributaria. Bajo el
          liderazgo del Director/a General, se toman decisiones estratégicas
          para garantizar el correcto funcionamiento de la entidad.
        </p>
        <ol className='list-decimal list-inside'>
          <li className='mb-2'>
            <span>
              Fortalecer los canales de comunicación y atención al ciudadano.
            </span>
          </li>
          <li className='mb-2'>
            <span>
              Implementar plataformas digitales que simplifiquen los trámites
              tributarios.
            </span>
          </li>
          <li className='mb-2'>
            <span>
              Mejorar los procesos internos para garantizar una gestión más ágil
              y efectiva.
            </span>
          </li>
          <li className='mb-2'>
            <span>
              Promover una cultura de cumplimiento tributario basada en la
              educación y el acompañamiento al contribuyente.
            </span>
          </li>
        </ol>

        <h3 className='text-2xl font-bold mt-8 mb-4'>
          Nuestra Promesa al Ciudadano
        </h3>
        <p className='mb-2'>
          Trabajamos día a día para ser un organismo que no solo recauda, sino
          que también apoya y acompaña a los ciudadanos en su relación con las
          obligaciones fiscales. Estamos comprometidos con el desarrollo de
          soluciones modernas y accesibles que generen beneficios directos para
          nuestra comunidad.
        </p>
      </section>
    </>
  );
}
