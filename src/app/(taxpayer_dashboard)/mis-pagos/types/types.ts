import {
  affidavit,
  declarable_tax,
  invoice,
  tax_penalties,
} from '@prisma/client';

export interface InvoiceWithRelations extends invoice {
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
