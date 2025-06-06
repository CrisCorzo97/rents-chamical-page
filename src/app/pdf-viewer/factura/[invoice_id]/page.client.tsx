'use client';

import { PDFViewer } from '@react-pdf/renderer';
import { useState } from 'react';
import MunicipalInvoice from '@/app/(client)/(sections)/tramites/DDJJ-actividad-comercial/components/InvoicePDF';
import dayjs from 'dayjs';
import {
  InvoiceWithRelations,
  ConceptToPay,
} from '@/app/(client)/(sections)/tramites/DDJJ-actividad-comercial/types';
import { commercial_enablement } from '@prisma/client';
import { User } from '@supabase/supabase-js';
import { formatName } from '@/lib/formatters';

export function InvoicePageClient({
  invoice,
  user,
  commercialEnablement,
}: {
  invoice: InvoiceWithRelations & { concepts: ConceptToPay[] };
  user: User;
  commercialEnablement: commercial_enablement;
}) {
  const [invoiceData] = useState({
    invoiceId: invoice.id,
    date: dayjs().format('DD/MM/YYYY'),
    taxpayerName: formatName(
      `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
    ),
    taxpayerId: user.user_metadata.tax_id ?? '-',
    address: commercialEnablement.address ?? '-',
    items: invoice.concepts,
    dueDate: dayjs(invoice.due_date).format('DD/MM/YYYY'),
    paymentInfo: {
      bank: 'Banco Rioja SAU',
      cbu: '3090005701001010001448',
      alias: 'CENTRO.PADRE.LIRIO',
      cuit: '30-12345678-9',
    },
  });

  return (
    <div className='h-screen w-full'>
      <PDFViewer className='h-full w-full'>
        <MunicipalInvoice invoiceData={invoiceData} />
      </PDFViewer>
    </div>
  );
}
