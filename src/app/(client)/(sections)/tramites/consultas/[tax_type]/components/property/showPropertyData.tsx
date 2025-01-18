'use client';

import { PropertyRecordWithRelations } from '@/app/(backoffice)/private/admin/property/property.interface';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/cn';
import { formatName } from '@/lib/formatters';
import clsx from 'clsx';
import dayjs from 'dayjs';

interface ShowPropertyDataProps {
  record: PropertyRecordWithRelations | null;
}

const ShowPropertyData = ({ record }: ShowPropertyDataProps) => {
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
              Información de la Propiedad
            </CardTitle>
          </CardHeader>
          <CardContent className='p-4'>
            <ul className='space-y-2'>
              <li>
                <strong>Contribuyente:</strong> {formatName(record.taxpayer)}
              </li>
              <li>
                <strong>Tipo de Contribuyente:</strong>{' '}
                {record.taxpayer_type ?? '-'}
              </li>
              <li>
                <strong>Matrícula:</strong> {record.enrollment}
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
                <strong>Es Parte:</strong> {record.is_part ? 'Sí' : 'No'}
              </li>
              <li>
                <strong>Dirección:</strong> {record.address}
              </li>
              <li>
                <strong>Longitud de Frente:</strong>{' '}
                {record.front_length ? `${record.front_length} metros` : '-'}
              </li>
              <li>
                <strong>Último Año Pagado:</strong> {record.last_year_paid}
              </li>
              {record.city_section && (
                <li>
                  <strong>Sección de la Ciudad:</strong>{' '}
                  {record.city_section.name}
                </li>
              )}
              {record.neighborhood && (
                <li>
                  <strong>Barrio:</strong>{' '}
                  {formatName(record.neighborhood.name)}
                </li>
              )}
              {record.missing_fields && (
                <li>
                  <strong>Campos Faltantes:</strong> {record.missing_fields}
                </li>
              )}
            </ul>
          </CardContent>
        </>
      )}
    </Card>
  );
};
export default ShowPropertyData;
