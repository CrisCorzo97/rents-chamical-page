import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';
import {
  getAffidavits,
  getBalance,
  getUpcomingDueDates,
} from './affidavit.actions';
import { BalanceCard } from './components/balance-card';
import { DuePeriodsCard } from './components/due-periods-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import { buildQuery } from '@/lib/url';
import AffidavitTable from './components/affidavit-table';
import { sortByToState } from '@/lib/table';

export type AffidavitStatus = 'pending_payment' | 'under_review' | 'finished';

export default async function CommercialActivityAffidavitPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    items_per_page?: string;
    status?: string;
    sort_by?: string;
    sort_direction?: string;
  }>;
}) {
  const { page, items_per_page, status, sort_by, sort_direction } =
    await searchParams;

  let order_by;

  const sortingState = sortByToState({
    sort_by: sort_by ?? '',
    sort_direction: sort_direction ?? '',
  });

  if (sort_by && sort_direction) {
    order_by = {
      [sort_by]: sort_direction,
    };
  }

  const affidavits = await getAffidavits({
    page,
    items_per_page,
    status: (status as AffidavitStatus) ?? 'pending_payment',
    order_by,
  });

  const balance = await getBalance();
  const duePeriods = await getUpcomingDueDates();

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

      <section className='grid grid-cols-1 gap-4 md:grid-cols-5'>
        <BalanceCard amount={balance.data ?? 0} />

        <DuePeriodsCard periods={duePeriods.data ?? []} />

        <Tabs defaultValue={status ?? 'pending_payment'} className='col-span-5'>
          <TabsList>
            <TabsTrigger value='pending_payment'>
              <Link
                href={`/tramites/DDJJ-actividad-comercial${buildQuery({
                  status: 'pending_payment',
                  page,
                  items_per_page,
                })}`}
              >
                Pendientes de pago
              </Link>
            </TabsTrigger>
            <TabsTrigger value='under_review'>
              <Link
                href={`/tramites/DDJJ-actividad-comercial${buildQuery({
                  status: 'under_review',
                  page,
                  items_per_page,
                })}`}
              >
                En revisión
              </Link>
            </TabsTrigger>
            <TabsTrigger value='finished'>
              <Link
                href={`/tramites/DDJJ-actividad-comercial${buildQuery({
                  status: 'finished',
                  page,
                  items_per_page,
                })}`}
              >
                Finalizados
              </Link>
            </TabsTrigger>
          </TabsList>
          <TabsContent value='pending_payment'>
            <AffidavitTable data={affidavits} sorting={sortingState} />
          </TabsContent>
          <TabsContent value='under_review'>
            <AffidavitTable data={affidavits} sorting={sortingState} />
          </TabsContent>
          <TabsContent value='finished'>
            <AffidavitTable data={affidavits} sorting={sortingState} />
          </TabsContent>
        </Tabs>
      </section>
    </section>
  );
}
