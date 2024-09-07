import { city_section, neighborhood, property } from '@prisma/client';

export type PropertyRecordWithRelations = property & {
  city_section: city_section | null;
  neighborhood: neighborhood | null;
};
