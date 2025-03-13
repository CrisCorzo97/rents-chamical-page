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
  getUserAndCommercialEnablement,
} from './affidavit.actions';
import { BalanceCard } from './components/balance-card';
import { DuePeriodsCard } from './components/due-periods-card';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui';
import { buildQuery } from '@/lib/url';
import AffidavitTable from './components/affidavit-table';
import { sortByToState } from '@/lib/table';
import { Info } from 'lucide-react';
import { getUser } from '@/lib/user';
import { formatName } from '@/lib/formatters';
import { redirect } from 'next/navigation';

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

  const { commercial_enablement } = await getUserAndCommercialEnablement();

  if (!commercial_enablement) {
    return redirect('/tramites/DDJJ-actividad-comercial/regularizar');
  }

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
  const user = await getUser();

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
        <div className='w-full flex items-center justify-between md:col-span-5'>
          {/* Agregar un visualizador del CUIT del contribuyente actual y un botón de cerrar sesión */}
          <Alert className='w-48 bg-yellow-100 border-yellow-500  md:col-span-5'>
            <AlertDescription>
              <p>
                <b>CUIT:</b> {user?.cuil ?? '-'}
              </p>
              <p>
                <b>Contribuyente:</b>{' '}
                {user
                  ? `${formatName(user.first_name)} ${formatName(
                      user.last_name
                    )}`
                  : '-'}
              </p>
            </AlertDescription>
          </Alert>

          <Link href='/auth/logout'>
            <Button variant='destructive' size='lg'>
              Cerrar sesión
            </Button>
          </Link>
        </div>

        <Alert className='my-6 w-full bg-blue-100 border-blue-500 md:col-span-5'>
          <Info className='w-4 h-4' />
          <AlertTitle>¡Aviso importante!</AlertTitle>
          <AlertDescription>
            Las presentaciones de DDJJ de actividad comercial se realizan de
            forma mensual y el pago de las mismas se realiza de forma bimestral.
          </AlertDescription>
        </Alert>

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
