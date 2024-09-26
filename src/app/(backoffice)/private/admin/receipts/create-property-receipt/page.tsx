import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ScrollArea } from '@/components/ui/scroll-area';
import { property } from '@prisma/client';
import Link from 'next/link';
import { ReceiptForm } from './receiptForm';

export default async function GeneratePropertyReceiptPage() {
  const onSearch = async (formData: FormData) => {
    'use server';
    const enrollment = formData.get('enrollment');

    const record: property = {
      id: 'adalksd',
      taxpayer: 'Mengano Fulano',
      taxpayer_type: null,
      enrollment: '3771-836-1948',
      is_part: false,
      id_neighborhood: BigInt(13),
      id_city_section: BigInt(1),
      address: 'Calle 1234',
      front_length: 10,
      last_year_paid: BigInt(2021),
      created_at: new Date('2021-09-29T00:00:00.000Z'),
      updated_at: new Date('2021-09-29T00:00:00.000Z'),
      missing_fields: null,
    };

    return enrollment === '3771-836-1948' ? record : null;
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
        <h1 className='text-2xl font-bold'>Crear comprobante de Inmueble</h1>
        <p className='text-gray-500 mt-2'>
          Complete el formulario para generar un comprobante de Inmueble.
        </p>

        <ReceiptForm />
      </article>
    </ScrollArea>
  );
}
