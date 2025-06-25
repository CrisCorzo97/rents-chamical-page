import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { getPendingAffidavits } from '../actions';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';
import { CreateInvoicePageClient } from './page.client';

export default async function CreateInvoicePage({
  searchParams,
}: {
  searchParams: Promise<{ taxId: string }>;
}) {
  const { taxId } = await searchParams;
  const { data: affidavits } = await getPendingAffidavits(taxId as string);

  return (
    <ScrollArea className='mx-6 h-admin-scroll-area'>
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
          <BreadcrumbItem>Portal Administrativo</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href='/private/admin/collection_management' prefetch>
                Gestión de Cobranza
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Generar Factura</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className='grid grid-cols-12 gap-4'>
        <CreateInvoicePageClient affidavits={affidavits ?? []} />
      </div>
    </ScrollArea>
  );
}
