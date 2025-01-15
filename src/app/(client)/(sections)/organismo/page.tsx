import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';

export default function Organism() {
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
            <BreadcrumbPage>Organismo</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <section className='text-lg max-w-6xl mx-auto mb-8'>
        <h1 className='text-4xl font-semibold mb-4'>Organismo</h1>
        <p className='mb-4 font-light'>
          La Dirección de Rentas Municipales es una institución clave en la
          gestión fiscal del municipio, encargada de administrar y supervisar
          las contribuciones tributarias que permiten el desarrollo y
          sostenibilidad de la comunidad. Este organismo trabaja con el
          compromiso de brindar un servicio eficiente, transparente y orientado
          a los ciudadanos.
        </p>

        <h3 className='text-2xl font-semibold mt-12 mb-4'>
          ¿Qué encontrarás en esta sección?
        </h3>
        <ol className='list-decimal list-inside font-light'>
          <li className='my-4 font-semibold'>
            <span className='font-light underline text-blue-500'>
              <Link href='/organismo/sobre-rentas'>
                <b>Sobre Rentas:</b>
              </Link>
            </span>
            <p className='font-light'>
              En este apartado se describe el rol fundamental de la Dirección de
              Rentas en el municipio, su historia y cómo su gestión impacta en
              el bienestar de la comunidad. También se detalla el marco
              normativo que regula su funcionamiento y los valores que guían su
              labor.
            </p>
          </li>
          <li className='mb-2 font-semibold'>
            <span className='font-light underline text-blue-500'>
              <Link href='/organismo/autoridades'>
                <b>Autoridades:</b>
              </Link>
            </span>
            <p className='font-light'>
              Aquí se presenta el equipo directivo que lidera la institución,
              destacando la experiencia y compromiso de quienes ocupan cargos
              clave. Además, encontrarás información de contacto y
              responsabilidades específicas de las autoridades principales, como
              el Director del área.
            </p>
          </li>
          <li className='mb-4 font-semibold'>
            <span className='font-light underline text-blue-500'>
              <Link href='/organismo/vision-y-mision'>
                <b>Visión y Misión:</b>
              </Link>
            </span>
            <p className='font-light'>
              La Dirección de Rentas tiene objetivos claros que definen su
              propósito y orientan sus acciones. Este apartado detalla:
            </p>
            <ul className='list-disc list-inside font-light ml-8'>
              <li className='mb-2'>
                <span>
                  La <b>visión</b>, como proyección futura del organismo.
                </span>
              </li>
              <li className='mb-2'>
                <span>
                  La <b>misión</b>, como su razón de ser y compromiso con los
                  ciudadanos. Estos principios son fundamentales para garantizar
                  una gestión transparente, eficiente y equitativa.
                </span>
              </li>
            </ul>
          </li>
          <li className='mb-4 font-semibold'>
            <span className='font-light underline text-blue-500'>
              <Link href='/organismo/funciones'>
                <b>Funciones:</b>
              </Link>
            </span>
            <p className='font-light'>
              Conoce las principales responsabilidades de la Dirección de
              Rentas, que incluyen:
            </p>
            <ul className='list-disc list-inside font-light ml-8'>
              <li className='mb-2'>
                <span>
                  Administración y recaudación de tasas y contribuciones
                  municipales.
                </span>
              </li>
              <li className='mb-2'>
                <span>
                  Promoción de una cultura tributaria que fomente el
                  cumplimiento ciudadano.
                </span>
              </li>
              <li className='mb-2'>
                <span>
                  Gestión de políticas fiscales que aseguren la sostenibilidad
                  financiera del municipio.
                </span>
              </li>
            </ul>
          </li>
        </ol>
      </section>
    </>
  );
}
