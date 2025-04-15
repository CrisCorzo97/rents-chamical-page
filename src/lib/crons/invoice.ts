import dbSupabase from '@/lib/prisma/prisma';
import dayjs from 'dayjs';
import { invoice } from '@prisma/client';
import { CalculateInfo } from '@/app/(client)/(sections)/tramites/DDJJ-actividad-comercial/types';

const getDeclarableTax = async () => {
  try {
    const declarableTax = await dbSupabase.declarable_tax.findFirst({
      where: {
        id: 'commercial_activity',
      },
    });

    if (!declarableTax) {
      throw new Error('No se encontró el impuesto declarable');
    }

    return declarableTax;
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Hubo un error al obtener el impuesto declarable');
  }
};

export const updateInvoiceFromCron = async (invoice: invoice) => {
  let interests = undefined;

  if (dayjs().isAfter(dayjs(invoice.due_date), 'day')) {
    // Si tienes una función para obtener la tasa de interés, úsala aquí
    const declarableTax = await getDeclarableTax();
    const compensatoryInterest =
      (declarableTax.calculate_info as CalculateInfo)?.compensatory_interest ??
      0;
    interests =
      invoice.fee_amount *
      compensatoryInterest *
      dayjs().diff(dayjs(invoice.due_date), 'day');
  }

  const updated = await dbSupabase.invoice.update({
    where: { id: invoice.id },
    data: {
      compensatory_interest: interests,
      updated_at: dayjs().toDate(),
    },
  });

  return updated;
};
