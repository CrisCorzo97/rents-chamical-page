import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { CardBalance } from './components/card-balance';
import { CardStatus } from './components/card-status';
import { DueDateTable } from './components/due-date-table';
import Link from 'next/link';
import {
  getBalance,
  getPeriodsDueDate,
  validateOblea,
} from './services/overview.action';

// Mock de datos basado en affidavits y tax_penalties
const mockData = {
  balance: {
    total: 15000.0,
    breakdown: {
      pendingAffidavits: 12000.0, // DDJJ pendientes de pago
      unpaidPenalties: 3000.0, // Multas sin pagar
    },
  },
  taxpayerStatus: {
    isUpToDate: false,
    lastPayment: '2024-03-15',
    nextDueDate: '2024-04-06',
  },
  upcomingDueDates: [
    {
      id: '1',
      tax_name: 'DDJJ Actividad Comercial',
      period: 'Abril 2025',
      due_date: '04/06/2025',
    },
    {
      id: '2',
      tax_name: 'DDJJ Actividad Comercial',
      period: 'Mayo 2025',
      due_date: '04/06/2025',
    },
    {
      id: '3',
      tax_name: 'DDJJ Actividad Comercial',
      period: 'Junio 2025',
      due_date: '05/08/2025',
    },
    {
      id: '4',
      tax_name: 'DDJJ Actividad Comercial',
      period: 'Julio 2025',
      due_date: '05/08/2025',
    },
  ],
};

export default async function ResumenPage() {
  const { data: balance } = await getBalance();
  const { canGenerate } = await validateOblea();
  const { data: periodsDueDate } = await getPeriodsDueDate();

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
            <BreadcrumbPage>Resumen</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-12'>
        {/* Card de Balance */}
        <CardBalance amount={balance ?? 0} />

        {/* Card de Estado */}
        <CardStatus isUpToDate={canGenerate} />

        {/* Tabla de Próximos Vencimientos */}
        <DueDateTable items={periodsDueDate ?? []} pagination={null} />
      </div>
    </div>
  );
}
