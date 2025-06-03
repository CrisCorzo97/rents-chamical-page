import { Metadata } from 'next';
import { CommercialEnablementTable } from './commercial-enablement-table';
import { getComercialEnablements } from './actions.commercial_enablement';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
export const metadata: Metadata = {
  title: 'Habilitaciones Comerciales',
  description: 'Gestión de habilitaciones comerciales',
};

export default async function CommercialEnablementPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const {
    page,
    limit,
    sort_by,
    sort_direction,
    'filter.taxpayer': taxpayer,
    'filter.company_name': company_name,
  } = await searchParams;

  const { data, pagination } = await getComercialEnablements({
    page: typeof page === 'string' ? parseInt(page) : undefined,
    limit: typeof limit === 'string' ? parseInt(limit) : 8,
    sort_by: typeof sort_by === 'string' ? sort_by : undefined,
    sort_direction:
      typeof sort_direction === 'string'
        ? (sort_direction as 'asc' | 'desc')
        : undefined,
    filters:
      taxpayer || company_name
        ? { taxpayer: taxpayer as string, company_name: company_name as string }
        : undefined,
  });

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
            <BreadcrumbPage>Habilitación comercial</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className='flex justify-end'>
        <Link href='/private/admin/commercial_enablement/create' prefetch>
          <Button className='flex items-center gap-2'>
            <Plus size={18} />
            Nuevo registro
          </Button>
        </Link>
      </div>

      <CommercialEnablementTable items={data ?? []} pagination={pagination} />
    </ScrollArea>
  );
}
