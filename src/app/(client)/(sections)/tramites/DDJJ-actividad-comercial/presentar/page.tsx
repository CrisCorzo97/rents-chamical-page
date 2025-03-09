import { Alert, AlertDescription, AlertTitle } from '@/components/ui';
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
import { TaxCalculatorCard } from '../components/tax-calculator-card';

export default async function CreateAffidavitPage({
  searchParams,
}: {
  searchParams: Promise<{
    period: string;
    dueDate: string;
  }>;
}) {
  const { period, dueDate } = await searchParams;

  return (
    <article className='max-w-6xl mx-auto mb-8'>
      <Breadcrumb className='h-12 mt-6'>
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
            <BreadcrumbLink asChild>
              <Link href='/tramites/DDJJ-actividad-comercial' prefetch>
                DDJJ Actividad Comercial
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Presentar</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <section className='mt-6'>
        <h1 className='text-2xl font-bold'>
          Presentación de Declaración Jurada
        </h1>

        <Alert className='my-6 w-full bg-blue-100 border-blue-500'>
          <Info className='w-4 h-4' />
          <AlertTitle>
            Información sobre la alícuota aplicada en base al monto declarado:
          </AlertTitle>
          <AlertDescription>
            <strong>
              Bancos - Entidades Financieras - Compañías Financieras
            </strong>
            <ul className='list-disc list-inside ml-4'>
              <li>Alícuota única (0,5%)</li>
            </ul>
            <strong>Comercios - Servicios - Industrias</strong>
            <ul className='list-disc list-inside ml-4'>
              <li>De $0 a $100.000.000 (0,15%)</li>
              <li>Mayor a $100.000.000 y hasta $200.000.000 (0,125%)</li>
              <li>Mayor a $200.000.000 y hasta $300.000.000 (0,1%)</li>
              <li>Mayor a $300.000.000 y hasta $400.000.000 (0,075%)</li>
              <li>Mayor a $400.000.000 y hasta $500.000.000 (0,05%)</li>
              <li>Mayor a $500.000.000 y hasta $1.000.000.000 (0,035%)</li>
              <li>Mayor a $1.000.000.000 (0,025%)</li>
            </ul>
            <span>
              <strong>Tasa mínima a abonar:</strong> $10.000
            </span>
          </AlertDescription>
        </Alert>

        <TaxCalculatorCard period={period} />
      </section>
    </article>
  );
}
