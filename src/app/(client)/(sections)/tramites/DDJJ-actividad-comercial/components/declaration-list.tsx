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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { Declaration } from '../types';

interface DeclarationsListProps {
  declarations: Declaration[];
  onUploadProof: (declaration: Declaration) => void;
}

export default function DeclarationsList({
  declarations,
  onUploadProof,
}: DeclarationsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Declarations</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Period</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Gross Amount</TableHead>
              <TableHead>Tax Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {declarations.map((declaration) => (
              <TableRow key={declaration.id}>
                <TableCell>
                  {new Date(declaration.period).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                  })}
                </TableCell>
                <TableCell>
                  {new Date(declaration.dueDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  ${declaration.grossAmount.toLocaleString()}
                </TableCell>
                <TableCell>
                  ${(declaration.grossAmount * 0.1).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      declaration.status === 'submitted'
                        ? 'default'
                        : 'secondary'
                    }
                  >
                    {declaration.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {declaration.status === 'pending' && (
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => onUploadProof(declaration)}
                      className='flex items-center gap-2'
                    >
                      <Upload className='h-4 w-4' />
                      Upload Proof
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
