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
import { getAffidavits } from './actions';
import { AffidavitsTable } from './affidavits-table';

export default async function AffidavitsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const {
    page,
    limit,
    sort_by,
    sort_direction,
    'filter.status': status,
    'filter.tax_id': taxId,
  } = await searchParams;

  const { data, pagination } = await getAffidavits({
    page: typeof page === 'string' ? parseInt(page) : undefined,
    limit: typeof limit === 'string' ? parseInt(limit) : 5,
    sort_by: typeof sort_by === 'string' ? sort_by : undefined,
    sort_direction:
      typeof sort_direction === 'string'
        ? (sort_direction as 'asc' | 'desc')
        : undefined,
    filters:
      status || taxId
        ? { status: status as string, tax_id: taxId as string }
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
            <BreadcrumbPage>DDJJ Realizadas</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <AffidavitsTable items={data ?? []} pagination={pagination ?? null} />
    </ScrollArea>
  );
}
