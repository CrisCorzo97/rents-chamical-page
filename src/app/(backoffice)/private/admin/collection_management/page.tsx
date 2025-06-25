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
import { getInvoicesWithRelations } from './actions';
import { CollectionManagementTable } from './collection-management-table';
import { affidavit_status } from '@prisma/client';
import { CreateInvoiceButton } from './components/create-invoice-button';

export default async function CollectionManagementPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const {
    page,
    limit,
    sort_by,
    sort_direction,
    'filter.id': id,
    'filter.user': user,
    'filter.taxpayer_id': tax_id,
    'filter.status': status,
  } = await searchParams;

  const data = await getInvoicesWithRelations({
    page: typeof page === 'string' ? parseInt(page) : undefined,
    limit: typeof limit === 'string' ? parseInt(limit) : 8,
    sort_by: typeof sort_by === 'string' ? sort_by : undefined,
    sort_direction:
      typeof sort_direction === 'string'
        ? (sort_direction as 'asc' | 'desc')
        : undefined,
    filters:
      status || id || user || tax_id
        ? {
            status: status as affidavit_status,
            id: id as string,
            user: user as string,
            tax_id: tax_id as string,
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
            <BreadcrumbPage>Gestión de Cobranza</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className='flex justify-end mb-4'>
        <CreateInvoiceButton />
      </div>

      <CollectionManagementTable
        items={data.data ?? []}
        pagination={data.pagination}
      />
    </ScrollArea>
  );
}
