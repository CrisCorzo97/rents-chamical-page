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
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { affidavit, affidavit_status } from '@prisma/client';
import { formatCurrency } from '@/lib/formatters';

dayjs.locale('es');

interface DeclarationsListProps {
  declarations: affidavit[];
  onUploadProof: (declaration: affidavit) => void;
}

export default function DeclarationsList({
  declarations,
  onUploadProof,
}: DeclarationsListProps) {
  declarations.sort((a, b) => dayjs(b.period).diff(dayjs(a.period)));

  const badgeDictionary: Record<
    affidavit_status,
    { text: string; variant: BadgeProps['variant'] }
  > = {
    pending_payment: { text: 'Pendiente de Pago', variant: 'outline' },
    under_review: { text: 'En Revisión', variant: 'default' },
    approved: { text: 'Aprobado', variant: 'secondary' },
    refused: { text: 'Rechazado', variant: 'destructive' },
    defeated: { text: 'Vencido', variant: 'destructive' },
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
                  {dayjs(declaration.due_date).format('DD/MM/YYYY')}
                </TableCell>
                <TableCell>
                  {formatCurrency(`${declaration.declared_amount}`)}
                </TableCell>
                <TableCell>
                  {formatCurrency(`${declaration.fee_amount}`)}
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
                  {declaration.status === 'pending_payment' && (
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
