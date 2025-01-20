import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';

export default function TaxInformation() {
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
            <BreadcrumbPage>Información Fiscal</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <section className='text-lg max-w-6xl mx-auto mb-8'>
        <h1 className='text-4xl font-semibold mb-4'>Información Fiscal</h1>
        <p className='mb-4 font-light'>
          La Dirección de Rentas pone a disposición de los ciudadanos
          información clara y accesible sobre las normativas que regulan las
          tasas y contribuciones municipales. Este apartado busca fomentar la
          transparencia en la gestión tributaria y promover el conocimiento de
          los derechos y obligaciones fiscales de los contribuyentes.
        </p>

        <h3 className='text-2xl font-semibold mt-12 mb-4'>
          ¿Qué encontrarás en esta sección?
        </h3>
        <ol className='list-decimal list-inside'>
          <li className='my-2 font-semibold'>
            <span>Leyes Municipales:</span>
            <ul className='list-disc list-inside font-light ml-8'>
              <li className='mb-2'>
                <span>
                  Recopilación de las leyes locales que establecen el marco
                  regulatorio para la administración tributaria.
                </span>
              </li>
              <li className='mb-2'>
                <span>
                  Normativas relacionadas con la creación, modificación y
                  aplicación de tasas y contribuciones.
                </span>
              </li>
            </ul>
          </li>
          <li className='my-2 font-semibold'>
            <span>Decretos:</span>
            <ul className='list-disc list-inside font-light ml-8'>
              <li className='mb-2'>
                <span>
                  Decretos ejecutivos que reglamentan aspectos específicos de
                  las tasas municipales.
                </span>
              </li>
              <li className='mb-2'>
                <span>
                  Resoluciones recientes que afectan a los contribuyentes.
                </span>
              </li>
            </ul>
          </li>
          <li className='my-2 font-semibold'>
            <span>Resoluciones:</span>
            <ul className='list-disc list-inside font-light ml-8'>
              <li className='mb-2'>
                <span>
                  Documentos emitidos por la Dirección de Rentas o autoridades
                  municipales con carácter vinculante.
                </span>
              </li>
              <li className='mb-2'>
                <span>
                  Detalles sobre cambios administrativos o técnicos en la
                  gestión tributaria.
                </span>
              </li>
            </ul>
          </li>
          <li className='my-2 font-semibold'>
            <span>Ordenanzas Fiscales:</span>
            <ul className='list-disc list-inside font-light ml-8'>
              <li className='mb-2'>
                <span>
                  Ordenanzas sancionadas por el Concejo Deliberante relacionadas
                  con la política tributaria.
                </span>
              </li>
              <li className='mb-2'>
                <span>
                  Ejemplo: Ordenanzas que establecen tasas por servicios
                  públicos o contribuciones por mejoras.
                </span>
              </li>
            </ul>
          </li>
          <li className='my-2 font-semibold'>
            <span>Actualizaciones y Modificaciones:</span>
            <ul className='list-disc list-inside font-light ml-8'>
              <li className='mb-2'>
                <span>
                  Historial de cambios normativos para que los ciudadanos estén
                  al tanto de las modificaciones más recientes en las
                  regulaciones fiscales.
                </span>
              </li>
            </ul>
          </li>
        </ol>

        <h3 className='text-2xl font-semibold mt-12 mb-4'>
          Importancia de la Información Fiscal
        </h3>
        <ul className='list-disc list-inside font-light'>
          <li className='mb-2'>
            <span>
              <b>Transparencia:</b> Garantizamos que los ciudadanos tengan
              acceso a las normativas que regulan la recaudación y el uso de los
              recursos municipales.
            </span>
          </li>
          <li className='mb-2'>
            <span>
              <b>Derechos del Contribuyente:</b> Facilitar el conocimiento de
              sus derechos para resolver inquietudes o aclarar dudas
              relacionadas con el cumplimiento tributario.
            </span>
          </li>
          <li className='mb-2'>
            <span>
              <b>Educación Fiscal:</b> Promovemos una cultura tributaria basada
              en la confianza y el entendimiento mutuo entre ciudadanos y
              autoridades.
            </span>
          </li>
        </ul>

        <h3 className='text-2xl font-semibold mt-12 mb-4'>
          ¿Cómo acceder a esta información?
        </h3>
        <ul className='list-disc list-inside font-light'>
          <li className='mb-2'>
            <span>
              <b>Descarga de Documentos:</b> Podrás descargar leyes, decretos,
              resoluciones y ordenanzas en formato PDF para una consulta más
              detallada.
            </span>
          </li>
          <li className='mb-2'>
            <span>
              <b>Sección de Búsqueda:</b> Encuentra fácilmente documentos
              específicos utilizando palabras clave o filtrando por tipo de
              normativa y año.
            </span>
          </li>
        </ul>

        <h3 className='text-2xl font-semibold mt-12 mb-4'>
          Preguntas Frecuentes sobre Información Fiscal
        </h3>
        <ul className='list-disc list-inside font-light'>
          <li className='mb-2'>
            <span>
              <b>¿Cómo saber si una normativa está vigente?</b> Todas las
              normativas publicadas en esta sección se mantienen actualizadas
              con las versiones más recientes.
            </span>
          </li>
          <li className='mb-2'>
            <span>
              <b>
                ¿Qué hacer si tengo dudas sobre el contenido de una ley o
                resolución?
              </b>{' '}
              Puedes contactarte con la Dirección de Rentas a través del Centro
              de Ayuda para recibir orientación personalizada.
            </span>
          </li>
        </ul>

        <h3 className='text-2xl font-semibold mt-12 mb-4'>
          Nuestro Compromiso
        </h3>
        <p className='mb-12 font-light'>
          Trabajamos para garantizar que toda la información fiscal sea
          accesible, comprensible y esté siempre actualizada, brindando a los
          ciudadanos herramientas para el cumplimiento tributario responsable.
        </p>
      </section>
    </>
  );
}
