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
  }>;
}) {
  const { period } = await searchParams;

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

        <Alert className='my-6 w-full bg-blue-100 border-blue-600'>
          <Info className='text-blue-600 mt-2' size={16} />
          <AlertTitle className='text-lg'>
            Información sobre la escala de montos a pagar
          </AlertTitle>
          <AlertDescription>
            <strong>
              Bancos - Entidades Financieras - Compañías Financieras
            </strong>
            <ul className='list-disc list-inside ml-4 mb-2'>
              <li>
                Cálculo de Base por Alícuota única <b>(0,5%)</b>
              </li>
            </ul>
            <strong>Comercios - Servicios - Industrias</strong>
            <ul className='list-disc list-inside ml-4 mb-2'>
              <li>
                De $0 a $5.000.000: <b>$7.500</b>
              </li>
              <li>
                Mayor a $5.000.000 y hasta $10.000.000: <b>$15.000</b>
              </li>
              <li>
                Mayor a $10.000.000 y hasta $20.000.000: <b>$30.000</b>
              </li>
              <li>
                Mayor a $20.000.000 y hasta $35.000.000: <b>$50.000</b>
              </li>
              <li>
                Mayor a $35.000.000 y hasta $50.000.000: <b>$70.000</b>
              </li>
              <li>
                Mayor a $50.000.000 y hasta $100.000.000: <b>$95.000</b>
              </li>
              <li>
                Mayor a $100.000.000 y hasta $200.000.000: <b>$125.000</b>
              </li>
              <li>
                Mayor a $200.000.000: <b>$165.000</b>
              </li>
            </ul>
            <p>
              Cabe destacar que la tasa mínima a abonar es de <b>$7.500</b>
            </p>
          </AlertDescription>
        </Alert>

        <TaxCalculatorCard period={period} />
      </section>
    </article>
  );
}
