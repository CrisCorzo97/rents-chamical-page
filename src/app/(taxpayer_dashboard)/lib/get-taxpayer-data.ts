'use server';
import dbSupabase from '@/lib/prisma/prisma';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { TaxpayerData } from '../types/types';

export const getTaxpayerData = async (): Promise<TaxpayerData> => {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (!user || error) {
      if (error) {
        throw new Error(error.message);
      }
      throw new Error('No se pudo obtener el usuario');
    }

    let commercial_enablements: TaxpayerData['commercial_enablements'] = [];
    let include_both_categories = false;

    const c_e_records = await dbSupabase.commercial_enablement.findMany({
      where: {
        tax_id: user.user_metadata.tax_id,
      },
      include: {
        commercial_activity: true,
        commercial_activity_commercial_enablement_second_commercial_activity_idTocommercial_activity: true,
        commercial_activity_commercial_enablement_third_commercial_activity_idTocommercial_activity: true,
      },
      orderBy: {
        registration_date: 'asc',
      },
    });

    if (c_e_records.length > 1) {
      const categories = {
        commercial: false,
        financial: false,
      };

      c_e_records.forEach((c_e_record) => {
        if (c_e_record.commercial_activity) {
          if (
            ['641930', '649290'].includes(c_e_record.commercial_activity.code)
          ) {
            categories.financial = true;
          } else {
            categories.commercial = true;
          }
        }
      });

      include_both_categories = categories.commercial && categories.financial;
    }

    commercial_enablements = c_e_records;

    return { user, commercial_enablements, include_both_categories };
  } catch (error) {
    redirect('/');
  }
};
