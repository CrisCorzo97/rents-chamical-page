import {
  getInvoice,
  getUserAndCommercialEnablement,
} from '../../affidavit.actions';
import { InvoicePageClient } from './page.client';

export default async function InvoicePage({
  params,
}: {
  params: Promise<{
    invoice_id: string;
  }>;
}) {
  const { invoice_id } = await params;

  const invoice = await getInvoice(invoice_id);
  const { user, commercial_enablement } =
    await getUserAndCommercialEnablement();

  return (
    <InvoicePageClient
      invoice={invoice.data!}
      user={user}
      commercialEnablement={commercial_enablement!}
    />
  );
}
