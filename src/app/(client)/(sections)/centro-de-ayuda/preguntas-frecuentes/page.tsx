import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';

export default function FAQ() {
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
              <Link href='/centro-de-ayuda' prefetch>
                Centro de Ayuda
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Preguntas Frecuentes</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <section className='text-lg max-w-6xl mx-auto mb-8'>
        <h1 className='text-4xl font-semibold mb-4'>Preguntas Frecuentes</h1>
        <p className='mb-4 font-light'>
          Encuentra respuestas rápidas y claras a tus dudas más comunes. En esta
          sección hemos recopilado las consultas más habituales de nuestros
          contribuyentes para facilitar tu experiencia y ahorrarte tiempo.
        </p>

        <h3 className='text-2xl font-semibold mt-12 mb-4'>
          Algunas de las preguntas frecuentes que respondemos:
        </h3>
        <ol className='list-decimal list-inside'>
          <li className='mb-4 font-semibold'>
            <span className='text-xl'>
              Cómo consultar el estado impositivo de una tasa:
            </span>
            <p className='mt-2 font-light'>
              Una guía detallada con imágenes para acceder fácilmente al sistema
              y visualizar tu estado impositivo.
            </p>
          </li>
          <li className='mb-4 font-semibold'>
            <span className='text-xl'>
              Pasos para regularizar tasas en mora:
            </span>
            <p className='mt-2 font-light'>
              Explicamos cómo generar un plan de regularización, descargar
              comprobantes y realizar el pago correspondiente.
            </p>
          </li>
          <li className='mb-4 font-semibold'>
            <span className='text-xl'>
              Interpretación de tus contribuciones:
            </span>
            <p className='mt-2 font-light'>
              Aprende a leer los datos de tus tasas y contribuciones para
              entender los conceptos facturados y las fechas de vencimiento.
            </p>
          </li>
          <li className='mb-4 font-semibold'>
            <span className='text-xl'>Navegación en la plataforma:</span>
            <p className='mt-2 font-light'>
              Descubre cómo utilizar las herramientas del sistema de manera
              efectiva, desde la consulta inicial hasta la descarga de
              documentos.
            </p>
          </li>
        </ol>

        <h3 className='text-2xl font-semibold mt-12 mb-4'>
          Formato interactivo:
        </h3>
        <ul className='list-disc list-inside font-light'>
          <li className='mb-2'>
            <span>
              Respuestas organizadas por categorías para una navegación más
              sencilla.
            </span>
          </li>
          <li className='mb-2'>
            <span>
              Funcionalidad de búsqueda para encontrar preguntas específicas de
              manera rápida.
            </span>
          </li>
        </ul>

        <p className='mb-4 font-light'>
          Explora nuestra base de conocimientos y obtén las respuestas que
          necesitas al instante.
        </p>
      </section>
    </>
  );
}
