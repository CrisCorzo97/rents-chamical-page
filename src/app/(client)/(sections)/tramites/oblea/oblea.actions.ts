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
};

const getPreviousBimester = () => {
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

const getAffidavits = async (tax_id: string) => {
  const [firstMonth, secondMonth] = getPreviousBimester();

  const affidavits = await dbSupabase.affidavit.findMany({
    where: {
      tax_id,
      period: {
        in: [firstMonth, secondMonth],
      },
    },
    include: {
      user: {
        select: {
          first_name: true,
          last_name: true,
        },
      },
    },
  });

  const taxpayerName = formatName(
    `${affidavits[0]?.user?.first_name ?? ''} ${
      affidavits[0]?.user?.last_name ?? ''
    }`
  );

  return { affidavits, firstMonth, secondMonth, taxpayerName };
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

    const { affidavits, secondMonth, taxpayerName } = await getAffidavits(
      tax_id
    );

    const isApproved = affidavits.every(
      (affidavit) => affidavit.status === 'approved'
    );

    if (!isApproved) {
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
      taxpayerName,
      cuit: tax_id,
      validUntil: dayjs(secondMonth)
        .add(2, 'month')
        .endOf('month')
        .format('DD/MM/YYYY'),
      mainActivity: commercial_enablement.commercial_activity?.activity!,
      otherActivities: otherActivities.filter((activity) => activity !== null),
      issueDate: dayjs().format('DD/MM/YYYY'),
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

    const { affidavits, secondMonth, taxpayerName } = await getAffidavits(
      tax_id
    );
    const isApproved = affidavits.every(
      (affidavit) => affidavit.status === 'approved'
    );

    response.licenseData = {
      commercialEnablementId: commercial_enablement.id,
      registrationNumber: commercial_enablement.registration_receipt!,
      businessName: commercial_enablement.company_name!,
      taxpayerName,
      cuit: tax_id,
      validUntil: dayjs(secondMonth)
        .add(2, 'month')
        .endOf('month')
        .format('DD/MM/YYYY'),
      mainActivity: commercial_enablement.commercial_activity?.activity!,
      otherActivities: [],
      issueDate: dayjs().format('DD/MM/YYYY'),
    };

    if (!isApproved) {
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
