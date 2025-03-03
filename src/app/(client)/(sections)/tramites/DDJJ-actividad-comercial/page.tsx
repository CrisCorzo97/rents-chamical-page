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
import { affidavit_status } from '@prisma/client';
import { buildQuery } from '@/lib/url';

export default async function CommercialActivityAffidavitPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    items_per_page?: string;
    status?: string;
  }>;
}) {
  const { page, items_per_page, status } = await searchParams;

  const declarations = await getAffidavits({
    page,
    items_per_page,
    status: (status as affidavit_status) ?? 'pending_payment',
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
          <TabsContent value='pending_payment'></TabsContent>
          <TabsContent value='under_review'></TabsContent>
          <TabsContent value='finished'></TabsContent>
        </Tabs>
      </section>
    </section>
  );
}
