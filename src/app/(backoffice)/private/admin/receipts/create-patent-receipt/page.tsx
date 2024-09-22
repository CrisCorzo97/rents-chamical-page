import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import Link from 'next/link';
import { createReceipt } from '../receipt-actions';
import { ReceiptForm } from './receiptForm';

export interface PatentReceiptData {
  created_at: string;
  domain: string;
  taxpayer: string;
  dni: string;
  vehicle: string;
  brand: string;
  year_to_pay: number;
  observations?: string;
  amount: number;
}

export default async function GeneratePatentReceiptPage() {
  const onSubmit = async (formData: PatentReceiptData) => {
    const createData: Prisma.receiptCreateInput = {
      id: randomUUID(),
      created_at: formData.created_at,
      taxpayer: formData.taxpayer,
      amount: formData.amount,
      tax_type: 'PATENTE',
      other_data: {
        domain: formData.domain,
        dni: formData.dni,
        vehicle: formData.vehicle,
        brand: formData.brand,
        year_to_pay: formData.year_to_pay,
        observations: formData.observations,
      },
    };

    await createReceipt({ data: createData });
  };

  return (
    <ScrollArea className='mx-6 h-admin-scroll-area'>
      <Breadcrumb className='h-12 mt-6'>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href='/' prefetch>
                Inicio
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Portal Administrativo</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href='/private/admin/receipts' prefetch>
                Comprobantes
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Crear</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <article className='mb-10'>
        <h1 className='text-2xl font-bold'>
          Crear comprobante de pago de Patente
        </h1>
        <p className='text-gray-500 mt-2'>
          Complete el formulario para generar un comprobante de pago de patente.
        </p>

        <ReceiptForm />
      </article>
    </ScrollArea>
  );
}
