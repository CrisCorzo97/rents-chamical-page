'use server';

import dbSupabase from '@/lib/prisma/prisma';
import dayjs from 'dayjs';

export const getCommercialEnablementByTaxId = async (tax_id: string) => {
  console.log(`Consultando registros para el CUIT: ${tax_id}`);
  try {
    const commercial_enablement =
      await dbSupabase.commercial_enablement.findMany({
        where: {
          tax_id,
        },
      });

    if (commercial_enablement.length === 0) {
      console.log(`No se encontraron registros para el CUIT: ${tax_id}`);
      return null;
    }

    const today = dayjs();
    const lastBimesterStart =
      today.month() % 2 === 0 ? today.month() : today.month() - 1;

    const affidavits = await dbSupabase.affidavit.findMany({
      where: {
        tax_id,
      },
      include: {
        invoice: true,
        user: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
      },
    });
  } catch (error) {
    console.error(
      'Error al consultar registros de habilitación comercial: ',
      error
    );
    throw error;
  }
};
