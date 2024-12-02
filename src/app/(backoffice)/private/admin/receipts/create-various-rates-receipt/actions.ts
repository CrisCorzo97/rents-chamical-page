'use server';

import dbSupabase from '@/lib/prisma/prisma';

export const getTaxesOrContributions = async () => {
  const taxes_or_contributions = await dbSupabase.tax_or_contribution.findMany({
    where: {
      status: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  return taxes_or_contributions;
};
