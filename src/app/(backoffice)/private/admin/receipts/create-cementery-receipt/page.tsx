import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cementery } from '@prisma/client';
import Link from 'next/link';
import { ReceiptForm } from './receiptForm';

export default async function GenerateCementeryReceiptPage() {
  const onSearch = async (formData: FormData) => {
    'use server';
    const fullName = formData.get('full_name');
    console.log({ fullName });
    const record: cementery = {
      id: 'adalksd',
      taxpayer: 'Mengano Fulano',
      address_taxpayer: 'Calle falsa 123',
      id_burial_type: BigInt(1),
      id_neighborhood: BigInt(16),
      section: '',
      row: null,
      location_number: null,
      id_cementery_place: BigInt(1),
      deceased_name: 'Dominguez Abel Omar',
      last_year_paid: BigInt(2021),
      created_at: new Date('2021-09-29T00:00:00.000Z'),
      updated_at: new Date('2021-09-29T00:00:00.000Z'),
      missing_fields: '["section","row","location_number"]',
    };

    return fullName === 'Dominguez Abel Omar' ? record : null;
  };

  const onSubmit = async (formData: FormData) => {
    'use server';
    const data = Object.fromEntries(formData.entries());
    console.log({ data });
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
        <h1 className='text-2xl font-bold'>Crear comprobante de Cementerio</h1>
        <p className='text-gray-500 mt-2'>
          Complete el formulario para generar un comprobante de Cementerio.
        </p>

        <ReceiptForm onSearch={onSearch} onSubmit={onSubmit} />
      </article>
    </ScrollArea>
  );
}
