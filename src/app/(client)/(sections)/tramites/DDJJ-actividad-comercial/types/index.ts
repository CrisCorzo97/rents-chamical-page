import { affidavit, invoice, user } from '@prisma/client';

export type AffidavitWithRelations = affidavit & {
  user: user | null;
  invoice: invoice | null;
};

export type InvoiceWithRelations = invoice & {
  affidavit: affidavit[] | null;
};

export type ConceptToPay = {
  id: string;
  concept: string;
  period: string;
  dueDate: string;
  amount: number;
};
