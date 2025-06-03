import { Metadata } from 'next';
import { PropertyTable } from './property-table';
import { getProperties } from './actions.property';
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
  title: 'Inmuebles',
  description: 'Gestión de inmuebles',
};

export default async function PropertyPage({
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
    'filter.enrollment': enrollment,
  } = await searchParams;

  const { data, pagination } = await getProperties({
    page: typeof page === 'string' ? parseInt(page) : undefined,
    limit: typeof limit === 'string' ? parseInt(limit) : 8,
    sort_by: typeof sort_by === 'string' ? sort_by : undefined,
    sort_direction:
      typeof sort_direction === 'string'
        ? (sort_direction as 'asc' | 'desc')
        : undefined,
    filters:
      taxpayer || enrollment
        ? {
            taxpayer: taxpayer as string,
            enrollment: enrollment as string,
          }
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
            <BreadcrumbPage>Inmuebles</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className='flex justify-end'>
        <Link href='/private/admin/property/create' prefetch>
          <Button className='flex items-center gap-2'>
            <Plus size={18} />
            Nuevo registro
          </Button>
        </Link>
      </div>

      <PropertyTable items={data ?? []} pagination={pagination} />
    </ScrollArea>
  );
}
