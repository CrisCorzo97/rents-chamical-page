import {
  getInvoice,
  getUserAndCommercialEnablement,
} from '@/app/(client)/(sections)/tramites/DDJJ-actividad-comercial/affidavit.actions';
import { InvoicePageClient } from './page.client';

export default async function InvoicePage({
  params,
}: {
  params: Promise<{
    invoice_id: string;
  }>;
}) {
  const { invoice_id } = await params;

  const invoice = await getInvoice({ invoice_id, concepts: true });
  const { user, commercial_enablement } =
    await getUserAndCommercialEnablement();

  if (!invoice.data || !user || !commercial_enablement) {
    return <div>No se encontró la factura o los datos del usuario</div>;
  }

  return (
    <InvoicePageClient
      invoice={invoice.data}
      user={user}
      commercialEnablement={commercial_enablement}
    />
  );
}
