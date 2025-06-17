import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { PaymentInstructionsCard } from '../../components/payment-instruction-card';
import { getInvoice } from '../../services/invoices.actions';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Instrucciones para el pago',
  description: 'Instrucciones para el pago de impuestos y multas',
};

export default async function PaymentInstructionsPage({
  params,
}: {
  params: Promise<{
    invoice_id: string;
  }>;
}) {
  const { invoice_id } = await params;

  const { data: invoice } = await getInvoice({
    invoice_id,
  });

  return (
    <article className='flex flex-col gap-4'>
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
          <BreadcrumbLink asChild>
            <Link href='/mis-pagos' prefetch>
              Mis Pagos
            </Link>
          </BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbLink asChild>
            <Link href='/mis-pagos/nuevo-pago' prefetch>
              Nuevo Pago
            </Link>
          </BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Instrucciones para el pago</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-12'>
        <PaymentInstructionsCard
          invoice={invoice!}
          bankDetails={{
            bank: 'Banco Rioja SAU',
            tax_id: '30-61490356-9',
            company_name: 'Municipalidad De Chamical',
            account_number: '0050100001000144',
            cbu: '3090005701001010001448',
            alias: 'CENTRO.PADRE.LIRIO',
          }}
        />
      </div>
    </article>
  );
}
