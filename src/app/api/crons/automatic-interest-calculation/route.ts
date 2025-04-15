import { updateInvoice } from '@/app/(client)/(sections)/tramites/DDJJ-actividad-comercial/affidavit.actions';
import dbSupabase from '@/lib/prisma/prisma';
import { invoice } from '@prisma/client';
import dayjs from 'dayjs';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Verificar si es una llamada de cron
  const cronKey = request.headers.get('x-vercel-cron-key');
  if (!cronKey || cronKey !== process.env.CRON_SECRET_KEY) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  let invoices: invoice[] = [];
  let currentInvoices: typeof invoices = [];

  try {
    do {
      currentInvoices = await dbSupabase.invoice.findMany({
        where: {
          payment_date: null,
          due_date: {
            lt: dayjs().startOf('day').toDate(),
          },
        },
        take: 100,
        skip: invoices.length,
      });

      invoices.push(...currentInvoices);
    } while (currentInvoices.length > 0);

    const invoicesUpdatedIds = [];
    const invoicesFailedIds = [];

    for (const invoice of invoices) {
      const { data, error } = await updateInvoice({ invoice_id: invoice.id });

      if (!data || error) {
        invoicesFailedIds.push(invoice.id);
        continue;
      } else {
        invoicesUpdatedIds.push(data.id);
      }
    }

    return NextResponse.json({
      status: 200,
      body: {
        invoicesUpdatedIds,
        invoicesFailedIds,
        message: 'Se actualizaron las facturas con éxito',
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error('Hubo un error al actualizar los intereses');
  }
}
