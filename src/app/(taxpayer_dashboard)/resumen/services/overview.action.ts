'use server';

import { dbSupabase } from '@/lib/prisma/prisma';
import { Envelope } from '@/types/envelope';
import dayjs from 'dayjs';
import { getTaxpayerData } from '../../lib/get-taxpayer-data';
import { LicenseData, ObleaValidation } from '../../types/types';
import { formatName } from '@/lib/formatters';
import { declarable_tax, declarable_tax_period } from '@prisma/client';

const BIMESTER_DICTIONARY = {
  1: [0, 1],
  2: [2, 3],
  3: [4, 5],
  4: [6, 7],
  5: [8, 9],
  6: [10, 11],
};

export const getBalance = async () => {
  const response: Envelope<number> = {
    success: true,
    data: null,
    error: null,
    pagination: null,
  };

  try {
    const { user } = await getTaxpayerData();

    const lte_payment_due_date =
      dayjs().month() === 2 || dayjs().month() === 4
        ? dayjs().add(1, 'month').endOf('month').toDate()
        : dayjs().endOf('month').toDate();

    const affidavits = await dbSupabase.affidavit.findMany({
      where: {
        user: { id: user.id },
        declarable_tax_id: 'commercial_activity',
        status: {
          in: ['pending_payment', 'refused'],
        },
        payment_due_date: {
          lte: lte_payment_due_date,
        },
      },
    });

    const taxPenalties = await dbSupabase.tax_penalties.findMany({
      where: {
        user: { id: user.id },
        declarable_tax_id: 'commercial_activity',
        payment_date: null,
      },
    });

    const total_amount =
      affidavits.reduce((acc, affidavit) => {
        return acc + affidavit.fee_amount;
      }, 0) +
      taxPenalties.reduce((acc, penalty) => {
        return acc + penalty.amount;
      }, 0);

    response.data = total_amount;
  } catch (error) {
    console.error(error);
    response.success = false;

    if (error instanceof Error) {
      response.error = error.message;
    } else {
      response.error = 'Hubo un error al obtener el saldo pendiente';
    }
  } finally {
    return response;
  }
};

export const getPeriodsDueDate = async () => {
  const response: Envelope<
    (declarable_tax_period & {
      declarable_tax: declarable_tax;
    })[]
  > = {
    success: true,
    data: null,
    error: null,
    pagination: null,
  };

  try {
    const periodsDueDate = await dbSupabase.declarable_tax_period.findMany({
      where: {
        start_date: {
          gte: dayjs().toDate(),
        },
      },
      include: {
        declarable_tax: true,
      },
      take: 6,
      orderBy: {
        period: 'asc',
      },
    });

    response.data = periodsDueDate;
  } catch (error) {
    console.error(error);
    response.success = false;

    if (error instanceof Error) {
      response.error = error.message;
    } else {
      response.error = 'Hubo un error al obtener las fechas de vencimiento';
    }
  } finally {
    return response;
  }
};

export async function validateOblea(): Promise<ObleaValidation> {
  const { commercial_enablements } = await getTaxpayerData();

  const oldestCommercialEnablement = commercial_enablements?.sort((a, b) =>
    dayjs(a.registration_date!).diff(dayjs(b.registration_date!))
  )[0];

  // 1. Determinar fechas relevantes
  const currentDate = dayjs();
  const currentYear = currentDate.year();
  const currentMonth = currentDate.month() + 1;
  const currentBimester = Math.ceil(currentMonth / 2);

  // Fecha de inicio de validación (1 de enero del año actual o fecha de registro si es posterior)
  const validationStartDate = dayjs(
    oldestCommercialEnablement?.registration_date!
  ).isAfter(dayjs().startOf('year'))
    ? dayjs(oldestCommercialEnablement?.registration_date!).startOf('month')
    : dayjs().startOf('year');

  // 3. Obtener todas las DDJJ aprobadas del año actual
  const affidavits = await dbSupabase.affidavit.findMany({
    where: {
      tax_id: commercial_enablements?.[0]?.tax_id!,
      declarable_tax: {
        id: 'commercial_activity',
      },
      period: {
        startsWith: `${currentYear}`,
      },
    },
  });

  // 4. Verificar DDJJ requeridas
  const missingAffidavits: string[] = [];
  let validBimesterFound = false;
  let validUntil = dayjs()
    .startOf('month')
    .add(3, 'month')
    .add(9, 'day')
    .toISOString(); // Inicialización por defecto

  // Iteramos desde el primer bimestre hasta el actual
  for (let bimester = 1; bimester < currentBimester; bimester++) {
    const months =
      BIMESTER_DICTIONARY[bimester as keyof typeof BIMESTER_DICTIONARY];

    if (months.every((month) => month < validationStartDate.month())) {
      continue;
    }

    // Sólo verificamos que estén aprobados los meses a partir de la fecha de registro
    const hasMonthsApproved = months.map((month) => {
      if (month < validationStartDate.month()) {
        return true;
      }
      const affidavit = affidavits.find((affidavit) => {
        const periodMonth = dayjs(affidavit.period).month();
        return periodMonth === month && affidavit.status === 'approved';
      });
      return affidavit !== undefined;
    });

    if (hasMonthsApproved.every((approved) => approved)) {
      // Calculamos la fecha de vigencia para este bimestre
      const nextBimesterStartDate = dayjs()
        .year(currentYear)
        .month(months[1] + 1)
        .startOf('month');

      const bimesterValidUntil = nextBimesterStartDate
        .add(3, 'month')
        .add(9, 'day');

      // Si la vigencia es posterior a la fecha actual + 10 días, este bimestre es válido
      if (bimesterValidUntil.isAfter(currentDate.add(10, 'day'))) {
        validBimesterFound = true;
        validUntil = bimesterValidUntil.toISOString();
        break;
      }
    } else {
      // Verificamos qué meses específicos faltan
      const missingMonths = months.filter((month) => {
        const affidavit = affidavits.find((affidavit) => {
          const periodMonth = dayjs(affidavit.period).month();
          return periodMonth === month && affidavit.status === 'approved';
        });
        return affidavit === undefined;
      });

      if (missingMonths.length > 0) {
        const missingMonthsNames = missingMonths
          .map((month) => formatName(dayjs().month(month).format('MMMM')))
          .join(' y ');

        missingAffidavits.push(`Bimestre ${bimester} - ${missingMonthsNames}`);
      }
    }
  }

  // Si no encontramos ningún bimestre válido, usamos la fecha del último bimestre requerido
  if (!validBimesterFound) {
    const lastRequiredBimester = currentBimester - 1;
    const lastMonths =
      BIMESTER_DICTIONARY[
        lastRequiredBimester as keyof typeof BIMESTER_DICTIONARY
      ];

    // Verificamos si el último bimestre requerido es posterior a la fecha de registro
    const lastBimesterStart = dayjs()
      .year(currentYear)
      .month(lastMonths[0])
      .startOf('month');

    if (lastBimesterStart.isAfter(validationStartDate)) {
      validUntil = dayjs()
        .year(currentYear)
        .month(lastMonths[1] + 1)
        .startOf('month')
        .add(3, 'month')
        .add(9, 'day')
        .toISOString();
    }
  }

  return {
    canGenerate: validBimesterFound,
    validUntil,
    missingAffidavits:
      missingAffidavits.length > 0 ? missingAffidavits : undefined,
  };
}

// Función para generar la oblea (podría ser un PDF o documento)
export async function generateOblea(): Promise<{
  data: LicenseData | null;
  error: string | null;
}> {
  const response: {
    data: LicenseData | null;
    error: string | null;
  } = {
    data: null,
    error: null,
  };

  try {
    const { commercial_enablements } = await getTaxpayerData();

    if (commercial_enablements?.length === 0) {
      response.error =
        'No se encontraron registros de habilitación comercial para este CUIT.';
      return response;
    }

    const validation = await validateOblea();

    if (!validation.canGenerate) {
      response.error = `No se puede generar la oblea. DDJJ faltantes: ${validation.missingAffidavits?.join(
        ', '
      )}`;
      return response;
    }

    const otherActivities = [
      commercial_enablements[0]
        .commercial_activity_commercial_enablement_second_commercial_activity_idTocommercial_activity
        ?.activity ?? null,
      commercial_enablements[0]
        .commercial_activity_commercial_enablement_third_commercial_activity_idTocommercial_activity
        ?.activity ?? null,
    ];

    const licenseData: LicenseData = {
      commercialEnablementId: commercial_enablements[0].id,
      registrationNumber: commercial_enablements[0].registration_receipt!,
      businessName: commercial_enablements
        .map((item) => formatName(item.company_name ?? ''))
        .filter((item) => item !== '')
        .join(' / '),
      taxpayerName: formatName(commercial_enablements[0].taxpayer!),
      cuit: commercial_enablements[0].tax_id!,
      validUntil: dayjs(validation.validUntil).format('DD/MM/YYYY'),
      mainActivity: commercial_enablements[0].commercial_activity?.activity!,
      otherActivities: otherActivities.filter((activity) => activity !== null),
      issueDate: dayjs().format('DD/MM/YYYY'),
      address: commercial_enablements
        .map((item) =>
          formatName(
            `${item.address ?? ''} ${item.address_number ?? ''}`
          ).trim()
        )
        .filter((item) => item !== '')
        .join(' / '),
    };

    response.data = licenseData;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      response.error = error.message;
    } else {
      response.error = 'Error al generar la oblea.';
    }
  } finally {
    return response;
  }
}

export const verifyOblea = async (tax_id: string) => {
  const response: {
    status: 'valid' | 'invalid';
    licenseData: LicenseData | null;
    error: string | null;
  } = {
    status: 'invalid',
    licenseData: null,
    error: null,
  };

  try {
    const { commercial_enablements } = await getTaxpayerData();

    if (commercial_enablements?.length === 0) {
      response.error =
        'No se encontraron registros de habilitación comercial para este CUIT.';
      return response;
    }

    const validation = await validateOblea();

    const otherActivities = [
      commercial_enablements[0]
        .commercial_activity_commercial_enablement_second_commercial_activity_idTocommercial_activity
        ?.activity ?? null,
      commercial_enablements[0]
        .commercial_activity_commercial_enablement_third_commercial_activity_idTocommercial_activity
        ?.activity ?? null,
    ];

    response.licenseData = {
      commercialEnablementId: commercial_enablements[0].id,
      registrationNumber: commercial_enablements[0].registration_receipt!,
      businessName: commercial_enablements
        .map((item) => formatName(item.company_name ?? ''))
        .filter((item) => item !== '')
        .join(' / '),
      taxpayerName: formatName(commercial_enablements[0].taxpayer!),
      cuit: tax_id,
      validUntil: validation.canGenerate
        ? dayjs(validation.validUntil).format('DD/MM/YYYY')
        : '-',
      mainActivity: commercial_enablements[0].commercial_activity?.activity!,
      otherActivities: otherActivities.filter((activity) => activity !== null),
      issueDate: dayjs().format('DD/MM/YYYY'),
      address: commercial_enablements
        .map((item) =>
          formatName(
            `${item.address ?? ''} ${item.address_number ?? ''}`
          ).trim()
        )
        .filter((item) => item !== '')
        .join(' / '),
    };

    if (!validation.canGenerate) {
      response.error = validation.missingAffidavits
        ? `El comercio no está habilitado para operar. DDJJ faltantes: ${validation.missingAffidavits.join(
            ', '
          )}`
        : 'El comercio no está habilitado para operar. Oblea no válida.';
    } else {
      response.status = 'valid';
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      response.status = 'invalid';
      response.error = error.message;
    } else {
      response.error = 'Error al verificar la oblea.';
    }
  } finally {
    return response;
  }
};
