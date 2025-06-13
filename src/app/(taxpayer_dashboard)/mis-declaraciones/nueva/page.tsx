import Link from 'next/link';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { getAffidavit } from '../services/affidavits.actions';
import dayjs from 'dayjs';
import locale from 'dayjs/locale/es';
import utc from 'dayjs/plugin/utc';
import { formatName } from '@/lib/formatters';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { TaxCalculatorCard } from '../components/tax-calculator-card';
import { getTaxpayerData } from '../../lib/get-taxpayer-data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui';

dayjs.locale(locale);
dayjs.extend(utc);

export default async function NuevaDeclaracionPage({
  searchParams,
}: {
  searchParams: Promise<{ period: string }>;
}) {
  const { period } = await searchParams;
  const { data: affidavit } = await getAffidavit({ period });
  const { include_both_categories } = await getTaxpayerData();

  return (
    <div className='flex flex-col gap-4'>
      <Breadcrumb className='mt-6 md:h-10'>
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
              <Link href='/mis-declaraciones' prefetch>
                Mis Declaraciones
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Nueva Declaración</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-12'>
        <Card className='md:col-span-12 flex flex-col gap-2 2xl:col-span-10'>
          <CardHeader>
            <CardTitle className='text-2xl font-bold '>
              Nueva Declaración
            </CardTitle>
            <CardDescription className='text-sm text-muted-foreground'>
              Período: {formatName(dayjs(period).format('MMMM YYYY'))}
              {affidavit ? ' - Rectificativa' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className='bg-blue-100 border-blue-600 2xl:col-span-10'>
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
          </CardContent>
        </Card>

        <TaxCalculatorCard
          period={period}
          isBothCategories={include_both_categories}
        />
      </div>
    </div>
  );
}
