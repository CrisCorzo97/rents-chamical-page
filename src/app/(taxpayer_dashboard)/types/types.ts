import { commercial_activity, commercial_enablement } from '@prisma/client';
import { User } from '@supabase/supabase-js';

export interface TaxpayerData {
  user: User;
  commercial_enablements:
    | (commercial_enablement & {
        commercial_activity: commercial_activity | null;
        commercial_activity_commercial_enablement_second_commercial_activity_idTocommercial_activity: commercial_activity | null;
        commercial_activity_commercial_enablement_third_commercial_activity_idTocommercial_activity: commercial_activity | null;
      })[];
  include_both_categories: boolean;
}

export interface ObleaValidation {
  canGenerate: boolean;
  validUntil: string;
  missingAffidavits?: string[];
}

export type LicenseData = {
  commercialEnablementId: string;
  registrationNumber: string;
  businessName: string;
  taxpayerName: string;
  cuit: string;
  validUntil: string;
  mainActivity: string;
  otherActivities?: string[];
  issueDate: string;
  address: string;
};
