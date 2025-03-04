import { affidavit, invoice, user } from '@prisma/client';

export type AffidavitWithRelations = affidavit & {
  user: user | null;
  invoice: invoice | null;
};
