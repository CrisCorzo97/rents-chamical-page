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
import { getUserAndCommercialEnablement } from '../affidavit.actions';
import { TaxCalculatorCard } from '../components/tax-calculator-card';

export default async function CreateAffidavitPage({
  searchParams,
}: {
  searchParams: Promise<{
    period: string;
  }>;
}) {
  const { period } = await searchParams;
  const { include_both_categories } = await getUserAndCommercialEnablement();

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
                Mayor a $5.000.000 y hasta $10.000.000: <b>$11.250</b>
              </li>
              <li>
                Mayor a $10.000.000 y hasta $20.000.000: <b>$16.875</b>
              </li>
              <li>
                Mayor a $20.000.000 y hasta $35.000.000: <b>$25.312,50</b>
              </li>
              <li>
                Mayor a $35.000.000 y hasta $50.000.000: <b>$37.968,75</b>
              </li>
              <li>
                Mayor a $50.000.000 y hasta $100.000.000: <b>$56.953,13</b>
              </li>
              <li>
                Mayor a $100.000.000 y hasta $200.000.000: <b>$85.429,69</b>
              </li>
              <li>
                Mayor a $200.000.000: <b>$128.144,53</b>
              </li>
            </ul>
            <p>
              Cabe destacar que la tasa mínima a abonar es de <b>$7.500</b>
            </p>
            <p className='mt-2'>
              Podés revisar los detalles de cada tramo en la{' '}
              <Link
                target='_blank'
                className='underline text-blue-600 font-semibold'
                href='https://fjksfkvauwungomvrlhm.supabase.co/storage/v1/object/public/documents//Ordenanza%20Nro%20552%20Tributaria%20Impositiva.pdf'
              >
                Ordenanza Nro 552
              </Link>
            </p>
          </AlertDescription>
        </Alert>

        <TaxCalculatorCard
          period={period}
          isBothCategories={include_both_categories}
        />
      </section>
    </article>
  );
}
