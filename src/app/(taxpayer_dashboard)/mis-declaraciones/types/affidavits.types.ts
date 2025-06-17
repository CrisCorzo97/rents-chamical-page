import { affidavit, declarable_tax, invoice } from '@prisma/client';

export interface AffidavitWithRelations extends affidavit {
  declarable_tax: declarable_tax | null;
  invoice: invoice | null;
}

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

export type PeriodToSubmit = {
  nextToSubmit: boolean;
  label: string;
  value: string;
  enabled: boolean;
};
