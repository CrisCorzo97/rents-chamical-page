import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  getAffidavits,
  getPeriodsToSubmit,
} from './services/affidavits.actions';
import Link from 'next/link';
import { AffidavitsTable } from './components/affidavits-table';
import { CreateAffidavitButton } from './components/create-affidavit-button';
import dayjs from 'dayjs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mis Declaraciones',
  description: 'Gestión de declaraciones de impuestos',
};

export default async function MisDeclaracionesPage({
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
    'filter.period': period,
  } = await searchParams;

  const { data: affidavits, pagination } = await getAffidavits({
    page: typeof page === 'string' ? parseInt(page) : undefined,
    limit: typeof limit === 'string' ? parseInt(limit) : undefined,
    sort_by: typeof sort_by === 'string' ? sort_by : undefined,
    sort_direction:
      typeof sort_direction === 'string'
        ? (sort_direction as 'asc' | 'desc')
        : undefined,
    filters:
      status || period
        ? {
            status: status as string,
            period: period as string,
          }
        : undefined,
  });

  const { data: periods } = await getPeriodsToSubmit(
    period ? dayjs(period as string).format('YYYY') : dayjs().format('YYYY')
  );

  return (
    <div className='flex flex-col gap-4'>
      <Breadcrumb className='mt-6 md:h-10'>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href='/' prefetch>
                Inicio
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Mis Declaraciones</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-12'>
        <div className='md:col-span-12 2xl:col-span-10 flex justify-end'>
          <CreateAffidavitButton periods={periods ?? []} />
        </div>
        <AffidavitsTable items={affidavits ?? []} pagination={pagination} />
      </div>
    </div>
  );
}
