import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';

export default function Information() {
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
            <BreadcrumbPage>Información</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <section className='text-lg max-w-6xl mx-auto mb-8'>
        <h1 className='text-4xl font-semibold mb-4'>Información</h1>
        <p className='mb-4 font-light'>
          En esta sección encontrarás toda la información necesaria sobre las tasas y contribuciones municipales, las normativas fiscales vigentes y las últimas novedades relacionadas con la gestión tributaria.
        </p>

        <h3 className='text-2xl font-semibold mt-12 mb-4'>Tasas / Contribuciones</h3>
        <p className='mb-4 font-light'>
          Accede a un detalle completo de las tasas y contribuciones municipales, incluyendo sus características, períodos de vencimiento y formas de regularización. Esta información te ayudará a mantenerte al día con tus obligaciones tributarias y evitar recargos innecesarios.
        </p>

        <h3 className='text-2xl font-semibold mt-12 mb-4'>Información Fiscal</h3>
        <p className='mb-4 font-light'>
          Consulta las normativas fiscales aplicables, como leyes, decretos, resoluciones y ordenanzas que regulan el sistema tributario municipal. Esta subsección está diseñada para garantizar la transparencia y facilitar el cumplimiento de las disposiciones legales.
        </p>

        <h3 className='text-2xl font-semibold mt-12 mb-4'>Novedades</h3>
        <p className='mb-4 font-light'>
          Mantente informado sobre las últimas noticias, actualizaciones y cambios en los procesos tributarios municipales. Aquí también podrás encontrar recordatorios importantes, anuncios de interés general y nuevas funcionalidades disponibles en la plataforma.
        </p>

        <h3 className='text-2xl font-semibold mt-12 mb-4'>Beneficios de esta Sección</h3>
        <ul className='list-disc list-inside font-light'>
          <li className='mb-2'>
            <span>Accesibilidad: Encuentra todo lo que necesitas saber sobre tus responsabilidades tributarias en un solo lugar.</span>
          </li>
          <li className='mb-2'>
            <span>Actualización constante: La información se mantiene al día para brindarte el mejor soporte.</span>
          </li>
          <li className='mb-2'>
            <span>Transparencia: Acceso directo a las normativas fiscales que rigen tus contribuciones.</span>
          </li>
        </ul>
      </section>
    </>
  );
}