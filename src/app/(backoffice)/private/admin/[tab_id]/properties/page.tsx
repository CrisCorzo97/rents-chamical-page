'use client';

import { Envelope } from '@/types/envelope';
import { property } from '@prisma/client';

interface PropertyTabProps {
  data: Envelope<property[]>;
}

export const PropertyTab = ({ data }: PropertyTabProps) => {
  return <div>PropertyTab</div>;
};
