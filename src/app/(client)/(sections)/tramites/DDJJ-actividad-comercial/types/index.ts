import { affidavit, invoice, tax_penalties, user } from '@prisma/client';

export type AffidavitWithRelations = affidavit & {
  user: user | null;
  invoice: invoice | null;
};

export type InvoiceWithRelations = invoice & {
  affidavit: affidavit[] | null;
  tax_penalties: tax_penalties[] | null;
};

export type ConceptToPay = {
  id: string;
  concept: string;
  period: string;
  dueDate: string;
  amount: number;
};

export type Subcase =
  | {
      type: 'variable';
      fee: number;
      label: string;
      amount_from: number;
      amount_up_to: number;
    }
  | {
      type: 'fixed';
      fixed_rate: number;
      label: string;
      amount_from: number;
      amount_up_to: number;
    };

export type Case = {
  category: string;
  subcases: Subcase[];
};

export type CalculateInfo = {
  cases: Case[];
  minimun_tax_amount: number;
  compensatory_interest: number;
};
