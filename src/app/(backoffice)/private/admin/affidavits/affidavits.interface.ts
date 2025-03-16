import { affidavit, declarable_tax, invoice, user } from '@prisma/client';

export interface AffidavitsWithRelations extends affidavit {
  user: user | null;
  invoice: invoice | null;
  declarable_tax: declarable_tax | null;
}
