import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { getDueDates } from './services/calendary.action';
import { DueDateTable } from './due-date-table';

export default async function CalendarioPage() {
  const { data: dueDates, pagination } = await getDueDates();

  return (
    <>
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
              <Link href='/informacion' prefetch>
                Información
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Calendario</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <section className='text-lg max-w-6xl mx-auto mb-8'>
        <h1 className='text-4xl font-semibold mb-4'>
          Calendario de Vencimientos
        </h1>
        <p className='mb-4 font-light'>
          En esta sección encontrarás el calendario de vencimientos de las tasas
          y contribuciones municipales.
        </p>

        <DueDateTable items={dueDates ?? []} pagination={pagination} />
      </section>
    </>
  );
}
