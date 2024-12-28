import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';

export default function HelpCenter() {
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
            <BreadcrumbPage>Centro de Ayuda</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <section className='max-w-6xl mx-auto mb-8 text-lg'>
        <h1 className='text-4xl font-bold mb-4'>Centro de Ayuda</h1>
        <p className='max-w-2xl'>
          El Centro de Ayuda es un espacio diseñado para ofrecer a los
          ciudadanos una guía práctica y rápida para resolver dudas, acceder a
          información relevante y facilitar la gestión de trámites relacionados
          con Rentas Municipales.
        </p>

        <h3 className='text-2xl font-bold mt-8 mb-4'>
          ¿Qué encontrarás en esta sección?
        </h3>
        <ol className='list-decimal list-inside'>
          <li className='mb-4 font-bold'>
            <span className='text-xl'>Contacto:</span>
            <ul className='list-disc list-inside font-normal'>
              <li className='my-2'>
                <span>
                  Información sobre cómo comunicarse con la Dirección de Rentas.
                </span>
              </li>
              <li className='mb-2'>
                <span>
                  Canales disponibles para consultas, sugerencias o reclamos:
                </span>
                <ul className='list-disc list-inside'>
                  <li className='ml-8'>
                    <span>
                      <b>Teléfono:</b> [+54 XXX XXX XXXX]
                    </span>
                  </li>
                  <li className='ml-8'>
                    <span>
                      <b>Correo electrónico:</b> [rentas@municipio.gov]
                    </span>
                  </li>
                  <li className='ml-8'>
                    <span>
                      <b>Atención presencial:</b> [Dirección de las oficinas]
                    </span>
                  </li>
                  <li className='ml-8'>
                    <span>
                      <b>Horario de atención:</b> [Lunes a viernes, de 8:00 a
                      14:00 horas]
                    </span>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
          <li className='mb-4 font-bold'>
            <span className='text-xl'>Preguntas Frecuentes:</span>
            <span className='block font-normal mt-2'>
              Respuestas claras y concisas a las dudas más comunes de los
              ciudadanos, como:
              <ul className='list-disc list-inside font-normal'>
                <li className='my-2'>
                  <span>¿Cómo consultar el estado impositivo de una tasa?</span>
                </li>
                <li className='mb-2'>
                  <span>¿Qué hacer si no recibí mi boleta de pago?</span>
                </li>
                <li className='mb-2'>
                  <span>¿Puedo pagar mis tasas en cuotas?</span>
                </li>
                <li className='mb-2'>
                  <span>
                    ¿Qué documentos necesito para realizar un trámite en Rentas?
                  </span>
                </li>
              </ul>
            </span>
          </li>
          <li className='mb-4 font-bold'>
            <span className='text-xl'>Instructivos / Tutoriales:</span>
            <ul className='list-disc list-inside font-normal'>
              <li className='my-2'>
                <span>
                  Guías paso a paso para realizar trámites comunes, por ejemplo:
                </span>
                <ul className='list-disc list-inside'>
                  <li className='ml-8'>
                    <span>
                      Consulta de estado impositivo: Cómo verificar el estado de
                      tus tasas y contribuciones utilizando el identificador
                      correspondiente.
                    </span>
                  </li>
                  <li className='ml-8'>
                    <span>
                      Impresión de boletas: Procedimiento para descargar e
                      imprimir boletas desde la página web.
                    </span>
                  </li>
                  <li className='ml-8'>
                    <span>
                      Actualización de datos personales: Cómo modificar
                      información registrada en el sistema de Rentas.
                    </span>
                  </li>
                </ul>
              </li>
              <li className='mb-2'>
                <span>
                  Material visual y didáctico, como videos y diagramas
                  explicativos, para facilitar el entendimiento de los procesos.
                </span>
              </li>
            </ul>
          </li>
          <li className='mb-4 font-bold'>
            <span className='text-xl'>Asistencia Personalizada:</span>
            <ul className='list-disc list-inside font-normal'>
              <li className='my-2'>
                <span>
                  Opciones para solicitar una cita o atención específica en las
                  oficinas de Rentas.
                </span>
              </li>
              <li className='mb-2'>
                <span>
                  Información sobre jornadas de atención especial para resolver
                  trámites complejos.
                </span>
              </li>
            </ul>
          </li>
        </ol>

        <h3 className='text-2xl font-bold mt-8 mb-4'>
          ¿Cómo utilizar esta sección?
        </h3>
        <ul className='list-disc list-inside'>
          <li className='mb-2'>
            <span>Explora los recursos organizados por categorías.</span>
          </li>
          <li className='mb-2'>
            <span>
              Si no encuentras lo que buscas, utiliza la barra de búsqueda para
              localizar información específica.
            </span>
          </li>
          <li className='mb-2'>
            <span>
              En caso de necesitar más ayuda, contacta a nuestro equipo a través
              de los canales habilitados.
            </span>
          </li>
        </ul>

        <h3 className='text-2xl font-bold mt-8 mb-4'>
          Compromiso con los Ciudadanos
        </h3>
        <p className='mb-2'>La Dirección de Rentas se compromete a:</p>
        <ul className='list-disc list-inside'>
          <li className='mb-2'>
            <span>Brindar información clara y accesible en todo momento.</span>
          </li>
          <li className='mb-2'>
            <span>
              Reducir los tiempos de espera y mejorar la experiencia del
              ciudadano.
            </span>
          </li>
          <li className='mb-2'>
            <span>
              Resolver dudas y consultas de manera eficiente y amable.
            </span>
          </li>
        </ul>
      </section>
    </>
  );
}
