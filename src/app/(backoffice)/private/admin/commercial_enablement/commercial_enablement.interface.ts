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
  commercial_activity_commercial_enablement_second_commercial_activity_idTocommercial_activity: commercial_activity | null;
  commercial_activity_commercial_enablement_third_commercial_activity_idTocommercial_activity: commercial_activity | null;
};
