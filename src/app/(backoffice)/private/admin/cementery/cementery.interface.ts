import {
  burial_type,
  cementery,
  cementery_place,
  neighborhood,
} from '@prisma/client';

export type CementeryRecordWithRelations = cementery & {
  neighborhood: neighborhood | null;
  burial_type: burial_type | null;
  cementery_place: cementery_place | null;
};
