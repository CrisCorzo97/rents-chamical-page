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
            <BreadcrumbPage>Organismo</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <section className='text-lg max-w-6xl mx-auto mb-8'>
        <h1 className='text-4xl font-bold mb-4'>Organismo</h1>

        <h2 className='text-3xl font-bold mb-4'>Sobre Rentas</h2>
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
        <p className='mb-8'>
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

        <hr className='mb-8' />

        <h2 className='text-3xl font-bold mb-4'>Autoridades</h2>
        <p className='max-w-2xl mb-4'>
          La Dirección de Rentas de la Municipalidad de Chamical está liderada
          por un equipo de profesionales comprometidos con la gestión
          transparente y eficiente de los recursos municipales. Las autoridades
          trabajan con un enfoque orientado al ciudadano, promoviendo la
          modernización de los procesos y garantizando el cumplimiento de las
          normativas fiscales.
        </p>

        <h3 className='text-2xl font-bold mt-8 mb-4'>
          Estructura de la Dirección de Rentas
        </h3>
        <p className='mb-2'>
          El organismo está organizado en distintas áreas que trabajan de manera
          coordinada para cumplir con sus funciones, entre ellas:
        </p>
        <ol className='list-decimal list-inside'>
          <li className='mb-2'>
            <span>Gestión de tasas y contribuciones.</span>
          </li>
          <li className='mb-2'>
            <span>Atención al ciudadano.</span>
          </li>
          <li className='mb-2'>
            <span>Fiscalización y control tributario.</span>
          </li>
          <li className='mb-2'>
            <span>Planificación y modernización.</span>
          </li>
        </ol>

        <h3 className='text-2xl font-bold mt-8 mb-4'>
          Dirección General de Rentas
        </h3>
        <p className='mb-2'>
          La Dirección General es el área responsable de supervisar y coordinar
          todas las actividades relacionadas con la gestión tributaria. Bajo el
          liderazgo del Director/a General, se toman decisiones estratégicas
          para garantizar el correcto funcionamiento de la entidad.
        </p>

        <h3 className='text-2xl font-bold mt-8 mb-4'>
          Datos del Director/a General del Área
        </h3>
        <p className='mb-2'>
          <b>Nombre completo:</b> [Nombre del director/a]
        </p>
        <p className='mb-2'>
          <b>Cargo:</b> Director/a General de Rentas
        </p>
        <p className='mb-2'>
          <b>Formación Académica:</b> [Título/s académico/s relevante/s]
        </p>
        <p className='mb-2'>
          <b>Experiencia Profesional:</b> [Breve descripción de la trayectoria
          laboral, destacando roles anteriores en gestión pública o privada]
        </p>
        <p className='mb-2'>
          <b>Objetivos en la Gestión:</b>
        </p>
        <ul className='list-disc list-inside'>
          <li className='mb-2'>
            <span>Modernizar los procesos tributarios.</span>
          </li>
          <li className='mb-2'>
            <span>
              Garantizar una relación transparente y accesible con los
              contribuyentes.
            </span>
          </li>
          <li className='mb-2'>
            <span>
              Implementar herramientas tecnológicas para optimizar los servicios
              de la Dirección.
            </span>
          </li>
        </ul>

        <h3 className='text-2xl font-bold mt-8 mb-4'>
          Mensaje del Director/a General
        </h3>
        <p className='mb-8'>
          <i>
            &quot;Es un honor liderar este equipo y trabajar al servicio de los
            ciudadanos de la Municipalidad de Chamical. Nuestro compromiso es
            garantizar que la Dirección de Rentas sea una institución modelo,
            ofreciendo servicios modernos, transparentes y orientados a las
            necesidades de nuestra comunidad.&quot;
          </i>
        </p>

        <hr className='mb-8' />

        <h2 className='text-3xl font-bold mb-4'>Misión y Visión</h2>
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
        <p className='mb-8'>
          Trabajamos día a día para ser un organismo que no solo recauda, sino
          que también apoya y acompaña a los ciudadanos en su relación con las
          obligaciones fiscales. Estamos comprometidos con el desarrollo de
          soluciones modernas y accesibles que generen beneficios directos para
          nuestra comunidad.
        </p>

        <hr className='mb-8' />

        <h2 className='text-3xl font-bold mb-4'>Funciones</h2>
        <p className='max-w-2xl mb-4'>
          La Dirección de Rentas de [nombre del municipio] tiene como propósito
          garantizar una gestión tributaria eficiente, orientada a satisfacer
          las necesidades de los ciudadanos y contribuir al desarrollo del
          municipio. Para lograrlo, desempeña una serie de funciones clave que
          abarcan desde la recaudación de recursos hasta la atención y el
          asesoramiento a los contribuyentes.
        </p>

        <h3 className='text-2xl font-bold mt-8 mb-4'>
          Principales Funciones de la Dirección de Rentas
        </h3>
        <ol className='list-decimal list-inside'>
          <li className='mb-2 font-bold'>
            <span className='text-xl'>Gestión y Recaudación de Tributos</span>
            <ul className='list-disc list-inside ml-8'>
              <li className='mb-2 font-normal'>
                Administrar y recaudar las tasas y contribuciones municipales,
                como las tasas de inmuebles, cementerios y otros servicios.
              </li>
              <li className='mb-2 font-normal'>
                Implementar métodos de cobro que sean accesibles y convenientes
                para los ciudadanos.
              </li>
            </ul>
          </li>
          <li className='mb-2 font-bold'>
            <span className='text-xl'>Fiscalización y Control</span>
            <ul className='list-disc list-inside ml-8'>
              <li className='mb-2 font-normal'>
                Supervisar el cumplimiento de las obligaciones tributarias.
              </li>
              <li className='mb-2 font-normal'>
                Detectar y prevenir irregularidades en el pago de tasas y
                contribuciones.
              </li>
              <li className='mb-2 font-normal'>
                Realizar auditorías periódicas para garantizar la transparencia
                en la gestión.
              </li>
            </ul>
          </li>
          <li className='mb-2 font-bold'>
            <span className='text-xl'>Atención al Ciudadano</span>
            <ul className='list-disc list-inside ml-8'>
              <li className='mb-2 font-normal'>
                Brindar información clara y precisa sobre las tasas y trámites
                disponibles.
              </li>
              <li className='mb-2 font-normal'>
                Ofrecer canales de atención que faciliten la comunicación entre
                los ciudadanos y la Dirección de Rentas.
              </li>
            </ul>
          </li>
          <li className='mb-2 font-bold'>
            <span className='text-xl'>Planificación y Modernización</span>
            <ul className='list-disc list-inside ml-8'>
              <li className='mb-2 font-normal'>
                Desarrollar estrategias para optimizar los procesos internos.
              </li>
              <li className='mb-2 font-normal'>
                Incorporar tecnologías innovadoras que permitan automatizar
                trámites y mejorar la experiencia de los contribuyentes.
              </li>
            </ul>
          </li>
          <li className='mb-2 font-bold'>
            <span className='text-xl'>Educación Fiscal</span>
            <ul className='list-disc list-inside ml-8'>
              <li className='mb-2 font-normal'>
                Promover una cultura de responsabilidad fiscal mediante campañas
                informativas.
              </li>
              <li className='mb-2 font-normal'>
                Concientizar a los ciudadanos sobre la importancia del
                cumplimiento tributario para el desarrollo del municipio.
              </li>
            </ul>
          </li>
          <li className='mb-2 font-bold'>
            <span className='text-xl'>Gestión de Información Fiscal</span>
            <ul className='list-disc list-inside ml-8'>
              <li className='mb-2 font-normal'>
                Administrar la base de datos tributaria municipal, asegurando la
                integridad y confidencialidad de la información.
              </li>
              <li className='mb-2 font-normal'>
                Generar reportes y estadísticas para una mejor toma de
                decisiones.
              </li>
            </ul>
          </li>
        </ol>

        <h3 className='text-2xl font-bold mt-8 mb-4'>
          Compromiso con la Comunidad
        </h3>
        <p className='mb-2'>
          Cada una de estas funciones está orientada a garantizar una gestión
          eficiente y transparente, asegurando que los recursos recaudados se
          traduzcan en beneficios tangibles para la comunidad.
        </p>

        <h3 className='text-2xl font-bold mt-8 mb-4'>
          Colaboración Interinstitucional
        </h3>
        <p className='mb-2'>
          La Dirección de Rentas trabaja en conjunto con otras áreas municipales
          para coordinar esfuerzos y garantizar el cumplimiento de los objetivos
          comunes, como el mejoramiento de los servicios públicos y el
          desarrollo de proyectos locales.
        </p>
      </section>
    </>
  );
}
