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
import { getCementeryRecords } from './actions.cementery';
import { CementeryTable } from './cementery-table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default async function CementeryPage({
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
    'filter.deceased_name': deceasedName,
  } = await searchParams;

  const data = await getCementeryRecords({
    page: typeof page === 'string' ? parseInt(page) : undefined,
    limit: typeof limit === 'string' ? parseInt(limit) : 8,
    sort_by: typeof sort_by === 'string' ? sort_by : undefined,
    sort_direction:
      typeof sort_direction === 'string'
        ? (sort_direction as 'asc' | 'desc')
        : undefined,
    filters:
      taxpayer || deceasedName
        ? {
            taxpayer: taxpayer as string,
            deceased_name: deceasedName as string,
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
            <BreadcrumbPage>Cementerio</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className='flex justify-end'>
        <Link href='/private/admin/cementery/create' prefetch>
          <Button className='flex items-center gap-2'>
            <Plus size={16} />
            Nuevo registro
          </Button>
        </Link>
      </div>

      <CementeryTable items={data.data ?? []} pagination={data.pagination} />
    </ScrollArea>
  );
}
