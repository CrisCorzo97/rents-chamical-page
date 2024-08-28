'use client';

import { Envelope } from '@/types/envelope';
import { cementery } from '@prisma/client';

interface CementeryTabProps {
  data: Envelope<cementery[]>;
}

export const CementeryTab = ({ data }: CementeryTabProps) => {
  return <div>CementeryTab</div>;
};
