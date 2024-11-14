import {
  city_section,
  commercial_activity,
  commercial_enablement,
  neighborhood,
} from '@prisma/client';

export type CommercialEnablementWithRelations = commercial_enablement & {
  city_section: city_section | null;
  neighborhood: neighborhood | null;
  commercial_activity: commercial_activity | null;
};
