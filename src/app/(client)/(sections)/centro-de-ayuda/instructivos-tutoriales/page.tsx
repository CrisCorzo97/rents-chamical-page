import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';

export default function InstructionalAndTutorial() {
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
            <BreadcrumbPage>Instructivos / Tutoriales</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <section className='text-lg max-w-6xl mx-auto mb-8'>
        <h1 className='text-4xl font-semibold mb-4'>
          Instructivos / Tutoriales
        </h1>
        <p className='mb-4 font-light'>
          Aprende paso a paso cómo gestionar tus trámites de manera eficiente.
          Esta sección está pensada para que puedas realizar tus gestiones en
          línea o entender mejor los procesos tributarios mediante guías
          prácticas y tutoriales detallados.
        </p>

        <h3 className='text-2xl font-semibold mt-12 mb-4'>
          Instructivos disponibles:
        </h3>
        <ol className='list-decimal list-inside'>
          <li className='mb-2 font-semibold'>
            <span className='text-xl'>
              Cómo consultar el estado impositivo de una tasa:
            </span>
            <p className='mt-2 font-light'>
              Una guía detallada con imágenes para acceder fácilmente al sistema
              y visualizar tu estado impositivo.
            </p>
          </li>
          <li className='mb-2 font-semibold'>
            <span className='text-xl'>
              Pasos para regularizar tasas en mora:
            </span>
            <p className='mt-2 font-light'>
              Explicamos cómo generar un plan de regularización, descargar
              comprobantes y realizar el pago correspondiente.
            </p>
          </li>
          <li className='mb-2 font-semibold'>
            <span className='text-xl'>
              Interpretación de tus contribuciones:
            </span>
            <p className='mt-2 font-light'>
              Aprende a leer los datos de tus tasas y contribuciones para
              entender los conceptos facturados y las fechas de vencimiento.
            </p>
          </li>
          <li className='mb-2 font-semibold'>
            <span className='text-xl'>Navegación en la plataforma:</span>
            <p className='mt-2 font-light'>
              Descubre cómo utilizar las herramientas del sistema de manera
              efectiva, desde la consulta inicial hasta la descarga de
              documentos.
            </p>
          </li>
        </ol>

        <h3 className='text-2xl font-semibold mt-12 mb-4'>
          Material adicional:
        </h3>
        <ul className='list-disc list-inside font-light'>
          <li className='mb-2'>
            <span>Videos explicativos con ejemplos prácticos.</span>
          </li>
          <li className='mb-2'>
            <span>
              Guías descargables en formato PDF para que tengas siempre a mano
              la información.
            </span>
          </li>
        </ul>

        <p className='mb-4 font-light'>
          Con estos recursos, manejar tus trámites será más sencillo que nunca.
        </p>
      </section>
    </>
  );
}
