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
import { getInvoice } from '../../affidavit.actions';

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
            <BreadcrumbLink asChild>
              <Link href='/tramites/DDJJ-actividad-comercial/pagar' prefetch>
                Pagar
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Instrucciones para el pago</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

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
    </article>
  );
}
