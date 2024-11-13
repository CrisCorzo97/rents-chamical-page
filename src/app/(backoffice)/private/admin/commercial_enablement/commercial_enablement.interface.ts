import {
  city_section,
  commercial_enablement,
  neighborhood,
} from '@prisma/client';

export type CommercialEnablementWithRelations = commercial_enablement & {
  city_section: city_section | null;
  neighborhood: neighborhood | null;
};
