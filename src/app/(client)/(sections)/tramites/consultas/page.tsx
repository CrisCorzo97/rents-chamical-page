import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Info } from 'lucide-react';
import Link from 'next/link';
import QueryModal from './components/queryModal';

export default function Queries() {
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
            <BreadcrumbLink asChild>
              <Link href='/tramites' prefetch>
                Trámites
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Consultas</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <section className='w-full text-base md:text-lg'>
        <h1 className='text-2xl md:text-3xl lg:text-4xl font-semibold mb-3 md:mb-4'>
          Consultas
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

        <h4 className='text-lg md:text-xl mb-3 md:mb-4'>
          Consultas disponibles actualmente:
        </h4>
        <QueryModal />

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

        <Alert className='mt-6 md:mt-8 mb-8 md:mb-12 w-full bg-blue-100 border-blue-500'>
          <Info className='w-4 h-4' />
          <AlertTitle>Nota importante:</AlertTitle>
          <AlertDescription>
            Actualmente, sólo está disponible el trámite de <b>consulta</b> a
            través de la web. Sin embargo, te invitamos a seguir visitando
            nuestra página, ya que pronto habilitaremos más opciones en línea.
          </AlertDescription>
        </Alert>
      </section>
    </>
  );
}
