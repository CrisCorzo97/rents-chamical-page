import {
  affidavit,
  declarable_tax,
  invoice,
  tax_penalties,
  user,
} from '@prisma/client';

export interface InvoiceWithRelations extends invoice {
  user: user | null;
  affidavit:
    | (affidavit & {
        declarable_tax: declarable_tax | null;
      })[]
    | null;
  tax_penalties:
    | (tax_penalties & {
        declarable_tax: declarable_tax | null;
      })[]
    | null;
}
