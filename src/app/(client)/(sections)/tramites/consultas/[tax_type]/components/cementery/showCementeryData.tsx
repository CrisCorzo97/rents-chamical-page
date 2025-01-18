'use client';

import { CementeryRecordWithRelations } from '@/app/(backoffice)/private/admin/cementery/cementery.interface';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/cn';
import { formatName } from '@/lib/formatters';
import clsx from 'clsx';
import dayjs from 'dayjs';

interface ShowCementeryDataProps {
  record: CementeryRecordWithRelations | null;
}

const ShowCementeryData = ({ record }: ShowCementeryDataProps) => {
  return (
    <Card
      className={cn(
        `w-full max-w-md bg-rose-100 transition-all duration-300`,
        clsx({
          'w-0 border-none': !record,
        })
      )}
    >
      {record && (
        <>
          <CardHeader className='p-4'>
            <CardTitle className='text-xl'>
              Información del Cementerio
            </CardTitle>
          </CardHeader>
          <CardContent className='p-4'>
            <ul className='space-y-2'>
              <li>
                <strong>Contribuyente:</strong> {formatName(record.taxpayer)}
              </li>
              <li>
                <strong>Dirección del Contribuyente:</strong>{' '}
                {record.address_taxpayer ?? '-'}
              </li>
              <li>
                <strong>Estado:</strong>{' '}
                {Number(record.last_year_paid) === dayjs().year() ? (
                  <Badge color='green'>Al día</Badge>
                ) : (
                  <Badge color='red'>Vencido</Badge>
                )}
              </li>
              <li>
                <strong>Sección:</strong> {record.section ?? '-'}
              </li>
              <li>
                <strong>Fila:</strong> {record.row ?? '-'}
              </li>
              <li>
                <strong>Número de Ubicación:</strong>{' '}
                {record.location_number ?? '-'}
              </li>
              {record.neighborhood && (
                <li>
                  <strong>Barrio:</strong>{' '}
                  {formatName(record.neighborhood.name)}
                </li>
              )}
              {record.burial_type && (
                <li>
                  <strong>Tipo de Entierro:</strong>{' '}
                  {formatName(record.burial_type.type)}
                </li>
              )}
              {record.cementery_place && (
                <li>
                  <strong>Lugar del Cementerio:</strong>{' '}
                  {formatName(record.cementery_place.name)}
                </li>
              )}
            </ul>
          </CardContent>
        </>
      )}
    </Card>
  );
};
export default ShowCementeryData;
