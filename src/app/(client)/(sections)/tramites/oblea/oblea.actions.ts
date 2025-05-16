'use server';

import { formatName } from '@/lib/formatters';
import dbSupabase from '@/lib/prisma/prisma';
import dayjs from 'dayjs';
import locale from 'dayjs/locale/es';
dayjs.locale(locale);

export type LicenseData = {
  commercialEnablementId: string;
  registrationNumber: string;
  businessName: string;
  taxpayerName: string;
  cuit: string;
  validUntil: string;
  mainActivity: string;
  otherActivities?: string[];
  issueDate: string;
  address: string;
};

const BIMESTER_DICTIONARY = {
  1: [0, 1],
  2: [2, 3],
  3: [4, 5],
  4: [6, 7],
  5: [8, 9],
  6: [10, 11],
};

const getCurrentBimester = () => {
  const today = dayjs();

  const currentBimesterStart =
    today.month() % 2 === 0 ? today.month() : today.month() - 1;
  const currentBimesterEnd = currentBimesterStart + 1;

  const [firstMonth, secondMonth] = [
    today
      .month(currentBimesterStart - 2)
      .startOf('month')
      .format('YYYY-MM-DD'),
    today
      .month(currentBimesterEnd - 2)
      .startOf('month')
      .format('YYYY-MM-DD'),
  ];

  return [firstMonth, secondMonth];
};

const getCommercialEnablement = async (tax_id: string) => {
  const commercial_enablement =
    await dbSupabase.commercial_enablement.findFirst({
      where: {
        tax_id,
      },
      include: {
        commercial_activity: true,
        commercial_activity_commercial_enablement_second_commercial_activity_idTocommercial_activity:
          true,
        commercial_activity_commercial_enablement_third_commercial_activity_idTocommercial_activity:
          true,
      },
    });

  return { commercial_enablement };
};

const getAffidavits = async (input: {
  tax_id: string;
  registration_date: Date;
}) => {
  const { tax_id, registration_date } = input;
  const [secondMonth] = getCurrentBimester();

  let initMonth = '2025-01-01';

  if (dayjs(registration_date).isAfter(dayjs(initMonth))) {
    initMonth = dayjs(registration_date).startOf('month').format('YYYY-MM-DD');
  }

  const requiredPeriods = [initMonth];

  while (requiredPeriods.at(-1) !== secondMonth) {
    requiredPeriods.push(
      dayjs(requiredPeriods[requiredPeriods.length - 1])
        .add(1, 'month')
        .format('YYYY-MM-DD')
    );
  }

  const affidavits = await dbSupabase.affidavit.findMany({
    where: {
      tax_id,
      period: {
        in: requiredPeriods,
      },
    },
  });

  return { affidavits, requiredPeriods, secondMonth };
};

export const generateOblea = async (tax_id: string) => {
  const response: {
    data: LicenseData | null;
    error: string | null;
  } = {
    data: null,
    error: null,
  };
  try {
    const { commercial_enablement } = await getCommercialEnablement(tax_id);

    if (!commercial_enablement) {
      throw new Error(
        'No se encontraron registros de habilitación comercial para este CUIT. Por favor, acercate a la oficina de rentas municipal para regularizar tu situación.'
      );
    }

    const { affidavits, requiredPeriods, secondMonth } = await getAffidavits({
      tax_id,
      registration_date: commercial_enablement.registration_date!,
    });

    if (affidavits.length < requiredPeriods.length) {
      throw new Error(
        'El CUIT ingresado no está habilitado para generar una oblea. Por favor, verifica tu estado tributario.'
      );
    }

    const isApproved = affidavits.every(
      (affidavit) => affidavit.status === 'approved'
    );

    if (!isApproved || affidavits.length === 0) {
      throw new Error(
        'El CUIT ingresado no está habilitado para generar una oblea. Por favor, verifica tu estado tributario.'
      );
    }

    const otherActivities = [
      commercial_enablement
        .commercial_activity_commercial_enablement_second_commercial_activity_idTocommercial_activity
        ?.activity ?? null,
      commercial_enablement
        .commercial_activity_commercial_enablement_third_commercial_activity_idTocommercial_activity
        ?.activity ?? null,
    ];

    const licenseData: LicenseData = {
      commercialEnablementId: commercial_enablement.id,
      registrationNumber: commercial_enablement.registration_receipt!,
      businessName: commercial_enablement.company_name!,
      taxpayerName: formatName(commercial_enablement.taxpayer!),
      cuit: tax_id,
      validUntil: dayjs(secondMonth)
        .add(2, 'month')
        .endOf('month')
        .format('DD/MM/YYYY'),
      mainActivity: commercial_enablement.commercial_activity?.activity!,
      otherActivities: otherActivities.filter((activity) => activity !== null),
      issueDate: dayjs().format('DD/MM/YYYY'),
      address: `${commercial_enablement.address} ${commercial_enablement.address_number}`,
    };

    response.data = licenseData;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      response.error = error.message;
    } else {
      response.error =
        'Error al consultar registros de habilitación comercial.';
    }
  } finally {
    return response;
  }
};

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
    const { commercial_enablement } = await getCommercialEnablement(tax_id);

    if (!commercial_enablement) {
      response.error =
        'No se encontraron registros de habilitación comercial para este CUIT.';
      return response;
    }

    const { affidavits, requiredPeriods, secondMonth } = await getAffidavits({
      tax_id,
      registration_date: commercial_enablement.registration_date!,
    });

    const isApproved = affidavits.every(
      (affidavit) => affidavit.status === 'approved'
    );

    response.licenseData = {
      commercialEnablementId: commercial_enablement.id,
      registrationNumber: commercial_enablement.registration_receipt!,
      businessName: commercial_enablement.company_name!,
      taxpayerName: formatName(commercial_enablement.taxpayer!),
      cuit: tax_id,
      validUntil: dayjs(secondMonth)
        .add(2, 'month')
        .endOf('month')
        .format('DD/MM/YYYY'),
      mainActivity: commercial_enablement.commercial_activity?.activity!,
      otherActivities: [],
      issueDate: dayjs().format('DD/MM/YYYY'),
      address: `${commercial_enablement.address} ${commercial_enablement.address_number}`,
    };

    if (
      affidavits.length === 0 ||
      affidavits.length < requiredPeriods.length ||
      !isApproved
    ) {
      response.error =
        'El comercio no está habilitado para operar. Oblea no válida.';
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

interface ObleaValidation {
  canGenerate: boolean;
  validUntil: string;
  missingAffidavits?: string[];
}

async function validateOblea(input: {
  taxId: string;
  commercialEnablementRegistrationDate: Date;
}): Promise<ObleaValidation> {
  const { taxId, commercialEnablementRegistrationDate } = input;

  // 1. Determinar fechas relevantes
  const currentDate = dayjs();
  const currentYear = currentDate.year();
  const currentMonth = currentDate.month() + 1;
  const currentBimester = Math.ceil(currentMonth / 2);

  // Fecha de inicio de validación (1 de enero del año actual o fecha de registro si es posterior)
  const validationStartDate = dayjs(
    commercialEnablementRegistrationDate
  ).isAfter(dayjs().startOf('year'))
    ? dayjs(commercialEnablementRegistrationDate)
    : dayjs().startOf('year');

  // 3. Obtener todas las DDJJ aprobadas del año actual
  const affidavits = await dbSupabase.affidavit.findMany({
    where: {
      tax_id: taxId,
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

    // Verificamos que ambos meses del bimestre estén aprobados
    const hasBothMonthsApproved = months.every((month) => {
      const affidavit = affidavits.find((affidavit) => {
        const periodMonth = dayjs(affidavit.period).month();
        return periodMonth === month && affidavit.status === 'approved';
      });
      return affidavit !== undefined;
    });

    if (hasBothMonthsApproved) {
      // Calculamos la fecha de vigencia para este bimestre
      const nextBimesterStartDate = dayjs()
        .year(currentYear)
        .month(months[1] + 1)
        .startOf('month');

      const bimesterValidUntil = nextBimesterStartDate
        .add(3, 'month')
        .add(9, 'day');

      // Si la vigencia es posterior a hoy, este bimestre es válido
      if (bimesterValidUntil.isAfter(currentDate)) {
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
    validUntil = dayjs()
      .year(currentYear)
      .month(lastMonths[1] + 1)
      .startOf('month')
      .add(3, 'month')
      .add(9, 'day')
      .toISOString();
  }

  return {
    canGenerate: validBimesterFound,
    validUntil,
    missingAffidavits:
      missingAffidavits.length > 0 ? missingAffidavits : undefined,
  };
}

// Función para generar la oblea (podría ser un PDF o documento)
export async function generateObleaV2(tax_id: string): Promise<{
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
    const { commercial_enablement } = await getCommercialEnablement(tax_id);

    if (!commercial_enablement) {
      response.error =
        'No se encontraron registros de habilitación comercial para este CUIT.';
      return response;
    }

    const validation = await validateOblea({
      taxId: tax_id,
      commercialEnablementRegistrationDate:
        commercial_enablement.registration_date!,
    });

    if (!validation.canGenerate) {
      response.error = `No se puede generar la oblea. DDJJ faltantes: ${validation.missingAffidavits?.join(
        ', '
      )}`;
      return response;
    }

    const otherActivities = [
      commercial_enablement
        .commercial_activity_commercial_enablement_second_commercial_activity_idTocommercial_activity
        ?.activity ?? null,
      commercial_enablement
        .commercial_activity_commercial_enablement_third_commercial_activity_idTocommercial_activity
        ?.activity ?? null,
    ];

    const licenseData: LicenseData = {
      commercialEnablementId: commercial_enablement.id,
      registrationNumber: commercial_enablement.registration_receipt!,
      businessName: commercial_enablement.company_name!,
      taxpayerName: formatName(commercial_enablement.taxpayer!),
      cuit: tax_id,
      validUntil: dayjs(validation.validUntil).format('DD/MM/YYYY'),
      mainActivity: commercial_enablement.commercial_activity?.activity!,
      otherActivities: otherActivities.filter((activity) => activity !== null),
      issueDate: dayjs().format('DD/MM/YYYY'),
      address: `${commercial_enablement.address} ${commercial_enablement.address_number}`,
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

export const verifyObleaV2 = async (tax_id: string) => {
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
    const { commercial_enablement } = await getCommercialEnablement(tax_id);

    if (!commercial_enablement) {
      response.error =
        'No se encontraron registros de habilitación comercial para este CUIT.';
      return response;
    }

    const validation = await validateOblea({
      taxId: tax_id,
      commercialEnablementRegistrationDate:
        commercial_enablement.registration_date!,
    });

    const otherActivities = [
      commercial_enablement
        .commercial_activity_commercial_enablement_second_commercial_activity_idTocommercial_activity
        ?.activity ?? null,
      commercial_enablement
        .commercial_activity_commercial_enablement_third_commercial_activity_idTocommercial_activity
        ?.activity ?? null,
    ];

    response.licenseData = {
      commercialEnablementId: commercial_enablement.id,
      registrationNumber: commercial_enablement.registration_receipt!,
      businessName: commercial_enablement.company_name!,
      taxpayerName: formatName(commercial_enablement.taxpayer!),
      cuit: tax_id,
      validUntil: validation.canGenerate
        ? dayjs(validation.validUntil).format('DD/MM/YYYY')
        : '-',
      mainActivity: commercial_enablement.commercial_activity?.activity!,
      otherActivities: otherActivities.filter((activity) => activity !== null),
      issueDate: dayjs().format('DD/MM/YYYY'),
      address: `${commercial_enablement.address} ${commercial_enablement.address_number}`,
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
