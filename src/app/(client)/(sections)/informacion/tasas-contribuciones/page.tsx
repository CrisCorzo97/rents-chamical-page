import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';

export default function TaxesAndContributions() {
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
            <BreadcrumbPage>Tasas / Contribuciones</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <section className='text-lg max-w-6xl mx-auto mb-8'>
        <h1 className='text-4xl font-semibold mb-4'>Tasas / Contribuciones</h1>
        <h4 className='mb-4'>
          Comunícate con nosotros de manera fácil y rápida.
        </h4>
        <p className='mb-4 font-light'>
          Si tienes alguna consulta, duda o necesitas asistencia personalizada,
          ponemos a tu disposición diversos canales de contacto para que te
          comuniques con la Dirección de Rentas:
        </p>

        <ul className='list-disc list-inside font-light'>
          <li className='my-2'>
            <span>
              <b>Correo Electrónico:</b>
            </span>
            <p className='font-light ml-6'>
              Envía tus consultas a nuestra dirección oficial, donde nuestro
              equipo las responderá a la brevedad. Ideal para solicitudes
              detalladas o envío de documentación.
            </p>
            <p className='font-light ml-6'>
              <b>Escríbenos a:</b>{' '}
              <a href='mailto:' className='underline text-blue-500'>
                [email@rentas.com]
              </a>
            </p>
          </li>
          <li className='mb-2'>
            <span>
              <b>Teléfono:</b>
            </span>
            <p className='font-light ml-6'>
              Habla directamente con uno de nuestros representantes para
              resolver tus inquietudes de manera inmediata.
            </p>
            <ul className='list-disc list-inside font-light ml-8'>
              <li className='mb-2'>
                <span>
                  Horarios de atención telefónica: Lunes a Viernes, de 9:00 a
                  17:00 horas.
                </span>
              </li>
              <li className='mb-2'>
                <span>
                  Comunicate al: <b>0800-123-RENTAS (736827)</b>
                </span>
              </li>
            </ul>
          </li>
          <li className='mb-2'>
            <span>
              <b>Atención Presencial:</b>
            </span>
            <p className='font-light ml-6'>
              Si prefieres resolver tus trámites personalmente, puedes
              visitarnos en nuestras oficinas.
            </p>
            <ul className='list-disc list-inside font-light ml-8'>
              <li className='mb-2'>
                <span>
                  Dirección: <b>Calle Principal 123, Ciudad</b>
                </span>
              </li>
              <li className='mb-2'>
                <span>
                  Horarios de atención:{' '}
                  <b>Lunes a Viernes, de 8:00 a 16:00 horas</b>.
                </span>
              </li>
            </ul>
          </li>
        </ul>

        <h4 className='my-4'>
          ¡Estamos aquí para ayudarte en todo lo que necesites!
        </h4>
      </section>
    </>
  );
}
