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
        <p className='mb-4 font-light'>
          Las tasas y contribuciones municipales representan el principal medio
          para financiar los servicios públicos y proyectos que benefician a la
          comunidad. A través de este aporte, los ciudadanos contribuyen al
          desarrollo y sostenimiento de su municipio, permitiendo mejorar la
          calidad de vida de todos los habitantes.
        </p>

        <h3 className='text-2xl font-semibold mt-12 mb-4'>
          ¿Qué son las tasas y contribuciones?
        </h3>

        <ul className='list-disc list-inside font-light'>
          <li className='mb-2'>
            <span>
              <b>Tasas Municipales:</b> Son importes que los ciudadanos deben
              abonar a cambio de servicios específicos provistos por el
              municipio, como el mantenimiento de la vía pública, recolección de
              residuos, iluminación, entre otros.
            </span>
          </li>
          <li className='mb-2'>
            <span>
              <b>Contribuciones Especiales:</b> Son pagos que los ciudadanos
              realizan en situaciones puntuales, generalmente vinculadas a obras
              públicas que incrementan el valor de sus propiedades o bienes,
              como pavimentación o extensión de redes de servicios básicos.
            </span>
          </li>
        </ul>

        <h3 className='text-2xl font-semibold mt-12 mb-4'>
          Principales Tasas y Contribuciones
        </h3>

        <ol className='list-decimal list-inside'>
          <li className='my-2 font-semibold'>
            <span>Tasa de Inmuebles:</span>
            <ul className='list-disc list-inside font-light ml-8'>
              <li className='mb-2'>
                <span>Aplica a propiedades urbanas y rurales.</span>
              </li>
              <li className='mb-2'>
                <span>
                  Contribuye al mantenimiento de servicios públicos esenciales.
                </span>
              </li>
            </ul>
          </li>
          <li className='my-2 font-semibold'>
            <span>Tasa de Cementerio:</span>
            <ul className='list-disc list-inside font-light ml-8'>
              <li className='mb-2'>
                <span>
                  Corresponde al uso de espacios y servicios en los cementerios
                  municipales.
                </span>
              </li>
            </ul>
          </li>
          <li className='my-2 font-semibold'>
            <span>Tasa de Seguridad e Higiene:</span>
            <ul className='list-disc list-inside font-light ml-8'>
              <li className='mb-2'>
                <span>
                  Dirigida a comercios y actividades económicas, para garantizar
                  el cumplimiento de normas sanitarias y de seguridad.
                </span>
              </li>
            </ul>
          </li>
          <li className='my-2 font-semibold'>
            <span>Contribuciones por Mejoras:</span>
            <ul className='list-disc list-inside font-light ml-8'>
              <li className='mb-2'>
                <span>
                  Incluye obras como asfaltado de calles, alumbrado público y
                  redes cloacales.
                </span>
              </li>
            </ul>
          </li>
        </ol>

        <h3 className='text-2xl font-semibold mt-12 mb-4'>
          ¿Cómo se calculan las tasas y contribuciones?
        </h3>
        <p className='mb-2 font-light'>
          El cálculo de cada tasa depende de diversos factores, tales como:
        </p>

        <ul className='list-disc list-inside font-light'>
          <li className='mb-2'>
            <span>El tipo y ubicación del inmueble.</span>
          </li>
          <li className='mb-2'>
            <span>La categoría fiscal asignada.</span>
          </li>
          <li className='mb-2'>
            <span>La superficie del terreno o propiedad.</span>
          </li>
          <li className='mb-2'>
            <span>Los servicios que se prestan en la zona.</span>
          </li>
        </ul>

        <p className='mb-2 font-light'>
          Las contribuciones especiales suelen calcularse en función del costo
          total de la obra y el beneficio directo que genera para los
          propietarios.
        </p>

        <h3 className='text-2xl font-semibold mt-12 mb-4'>
          Formas de Pago Disponibles
        </h3>
        <ul className='list-disc list-inside font-light'>
          <li className='mb-2'>
            <span>
              Pago presencial en las oficinas de la Dirección de Rentas.
            </span>
          </li>
          <li className='mb-2'>
            <span>
              Transferencias bancarias o medios digitales habilitados.
            </span>
          </li>
          <li className='mb-2'>
            <span>
              Planes de pago para regularizar deudas (sujetos a disponibilidad).
            </span>
          </li>
        </ul>

        <h3 className='text-2xl font-semibold mt-12 mb-4'>
          Beneficios de estar al día con las tasas
        </h3>
        <ul className='list-disc list-inside font-light'>
          <li className='mb-2'>
            <span>Acceso a descuentos y bonificaciones por cumplimiento.</span>
          </li>
          <li className='mb-2'>
            <span>Participación en programas de estímulo fiscal.</span>
          </li>
          <li className='mb-2'>
            <span>Evitar recargos o intereses por mora.</span>
          </li>
        </ul>

        <h3 className='text-2xl font-semibold mt-12 mb-4'>
          Compromiso con el Contribuyente
        </h3>
        <p className='mb-12 font-light'>
          La Dirección de Rentas se compromete a brindar información clara y
          accesible sobre las tasas y contribuciones, facilitando su pago y
          promoviendo una relación de confianza con los ciudadanos.
        </p>
      </section>
    </>
  );
}
