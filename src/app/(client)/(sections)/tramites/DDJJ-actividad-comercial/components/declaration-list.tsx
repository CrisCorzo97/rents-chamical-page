'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { Declaration } from '../types';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

dayjs.locale('es');

interface DeclarationsListProps {
  declarations: Declaration[];
  onUploadProof: (declaration: Declaration) => void;
}

export default function DeclarationsList({
  declarations,
  onUploadProof,
}: DeclarationsListProps) {
  declarations.sort((a, b) => dayjs(b.period).diff(dayjs(a.period)));

  const badgeDictionary: Record<
    Declaration['status'],
    { text: string; variant: BadgeProps['variant'] }
  > = {
    payment_pending: {
      text: 'Pendiente de pago',
      variant: 'outline',
    },
    payment_review: {
      text: 'En revisión',
      variant: 'default',
    },
    approved: {
      text: 'Aprobado',
      variant: 'secondary',
    },
    rejected: {
      text: 'Rechazado',
      variant: 'destructive',
    },
    defeated: {
      text: 'Vencido',
      variant: 'destructive',
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Declaraciones</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Período</TableHead>
              <TableHead>Fecha de Vencimiento</TableHead>
              <TableHead>Importe Bruto</TableHead>
              <TableHead>Importe del Impuesto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {declarations.map((declaration) => (
              <TableRow key={declaration.id}>
                <TableCell>
                  {dayjs(declaration.period).format('MMMM YYYY')}
                </TableCell>
                <TableCell>
                  {dayjs(declaration.dueDate).format('DD/MM/YYYY')}
                </TableCell>
                <TableCell>
                  ${declaration.grossAmount.toLocaleString()}
                </TableCell>
                <TableCell>
                  ${(declaration.grossAmount * 0.1).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge
                    className='text-sm'
                    variant={badgeDictionary[declaration.status].variant}
                  >
                    {badgeDictionary[declaration.status].text}
                  </Badge>
                </TableCell>
                <TableCell>
                  {declaration.status === 'payment_pending' && (
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => onUploadProof(declaration)}
                      className='flex items-center gap-2'
                    >
                      <Upload className='h-4 w-4' />
                      Subir Comprobante
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
