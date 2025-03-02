import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { CommercialActivityAffidavitClient } from './page.client';
import { getUpcomingDueDates, getAffidavits } from './affidavit.actions';

export default async function CommercialActivityAffidavitPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; items_per_page?: string }>;
}) {
  const { page, items_per_page } = await searchParams;

  const upcomingDueDatesPeriods = await getUpcomingDueDates();
  const declarations = await getAffidavits({
    page,
    items_per_page,
  });

  return (
    <section className='text-lg max-w-6xl mx-auto mb-8'>
      <Breadcrumb className='max-w-6xl mx-auto h-20'>
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
            <BreadcrumbLink asChild>
              <Link href='/tramites' prefetch>
                Trámites
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>DDJJ Actividad Comercial</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <CommercialActivityAffidavitClient
        declarations={declarations.data ?? []}
        upcomingDueDatesPeriods={upcomingDueDatesPeriods.data ?? []}
      />
    </section>
  );
}
