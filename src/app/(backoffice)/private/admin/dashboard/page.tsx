import { Suspense } from 'react';
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

// Importar componentes del dashboard
import { DashboardContent, DashboardLoading } from './page.client';

// ============================================================================
// PÁGINA PRINCIPAL
// ============================================================================

export default async function DashboardPage() {
  return (
    <ScrollArea className='h-admin-scroll-area flex flex-col px-6 bg-neutral-100'>
      {/* Breadcrumb */}
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
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Contenido del Dashboard */}
      <div className='py-6'>
        <Suspense fallback={<DashboardLoading />}>
          <DashboardContent />
        </Suspense>
      </div>
    </ScrollArea>
  );
}
