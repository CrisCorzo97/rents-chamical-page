import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import Link from 'next/link';

export default function Formalities() {
  return (
    <>
      <Breadcrumb className='w-full h-16 md:h-20'>
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
            <BreadcrumbPage>Trámites</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <section className='w-full text-base md:text-lg'>
        <h1 className='text-2xl md:text-3xl lg:text-4xl font-semibold mb-3 md:mb-4'>
          Trámites
        </h1>
        <p className='mb-3 md:mb-4 font-light'>
          La sección de Trámites de la Dirección de Rentas Municipales tiene
          como objetivo facilitar a los ciudadanos el acceso a información y la
          realización de diversos procedimientos relacionados con tasas y
          contribuciones. Actualmente, algunos trámites pueden realizarse de
          manera presencial, mientras que otros se encuentran disponibles para
          consulta o inicio a través de esta página web.
        </p>
        <p className='mb-3 md:mb-4 font-light'>
          En esta etapa inicial, la funcionalidad en línea está limitada a
          consultas específicas, pero estamos trabajando para ampliar nuestra
          oferta de servicios online. Pronto, los ciudadanos podrán realizar más
          trámites de manera completamente digital, optimizando tiempo y
          recursos.
        </p>

        <h3 className='text-xl md:text-2xl font-semibold mt-8 md:mt-12 mb-3 md:mb-4'>
          Consultas
        </h3>
        <p className='mb-3 md:mb-4 font-light'>
          Las consultas son un conjunto de herramientas diseñadas para brindar
          información al ciudadano de forma rápida y sencilla.
        </p>
        <h4 className='text-lg md:text-xl font-semibold mt-6 md:mt-8 mb-3 md:mb-4'>
          Consultas disponibles actualmente:
        </h4>
        <ol className='list-decimal list-inside space-y-4'>
          <li className='font-semibold'>
            <span className='text-lg md:text-xl'>
              Estado Impositivo de Tasas:
            </span>
            <p className='mt-2 font-light'>
              Permite verificar la situación fiscal del ciudadano con respecto a
              contribuciones como tasa de inmueble o tasa de cementerio.
            </p>
          </li>
          <li className='font-semibold'>
            <span className='text-lg md:text-xl'>Historial de Pagos:</span>
            <p className='mt-2 font-light'>
              Ofrece un registro detallado de los pagos realizados previamente,
              incluyendo comprobantes descargables.
            </p>
          </li>
          <li className='font-semibold'>
            <span className='text-lg md:text-xl'>Fechas Importantes:</span>
            <p className='mt-2 font-light'>
              Calendario con los plazos más relevantes para el pago de tasas y
              contribuciones municipales.
            </p>
          </li>
          <li className='font-semibold'>
            <span className='text-lg md:text-xl'>Estado de Trámites:</span>
            <p className='mt-2 font-light'>
              Proporciona información sobre el progreso de trámites iniciados en
              la Dirección de Rentas.
            </p>
          </li>
        </ol>

        <h3 className='text-xl md:text-2xl font-semibold mt-8 md:mt-12 mb-3 md:mb-4'>
          ¿Qué trámites estarán disponibles próximamente?
        </h3>
        <p className='mb-3 md:mb-4 font-light'>
          Estamos desarrollando una plataforma digital que permitirá realizar
          diversos trámites directamente desde esta página web, entre ellos:
        </p>
        <ul className='list-disc list-inside font-light space-y-2'>
          <li>Solicitud de certificados de libre deuda.</li>
          <li>Actualización de datos del contribuyente.</li>
          <li>Solicitud de planes de pago.</li>
          <li>Gestión de exenciones tributarias.</li>
        </ul>
        <p className='mb-3 md:mb-4 font-light'>
          Cada trámite estará diseñado para garantizar una experiencia ágil y
          segura, con el objetivo de reducir la necesidad de asistir
          presencialmente a las oficinas.
        </p>

        <h3 className='text-xl md:text-2xl font-semibold mt-8 md:mt-12 mb-3 md:mb-4'>
          Beneficios de los trámites en línea:
        </h3>
        <ul className='list-disc list-inside font-light space-y-2'>
          <li>
            Mayor comodidad al poder realizar trámites desde cualquier lugar.
          </li>
          <li>Transparencia en la información y los procedimientos.</li>
          <li>Reducción de tiempos de espera y filas en las oficinas.</li>
        </ul>

        <Alert className='my-6 md:my-8 w-full bg-blue-100 border-blue-500'>
          <Info className='w-4 h-4' />
          <AlertTitle>Nota importante:</AlertTitle>
          <AlertDescription>
            Actualmente, sólo está disponible el trámite de consulta a través de
            la web. Sin embargo, te invitamos a seguir visitando nuestra página,
            ya que pronto habilitaremos más opciones en línea.
          </AlertDescription>
        </Alert>
      </section>
    </>
  );
}
