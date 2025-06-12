import { affidavit, declarable_tax, invoice } from '@prisma/client';

export interface AffidavitWithRelations extends affidavit {
  declarable_tax: declarable_tax | null;
  invoice: invoice | null;
}
