import { WorkInProgressIllustration } from '@/assets/illustrations';
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

export default async function DashboardPage() {
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
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className='flex flex-col items-center justify-center h-full'>
        <WorkInProgressIllustration className='w-80 h-80 mx-auto mt-12' />
        <h1 className='text-2xl font-bold text-center mt-6'>
          ¡Estamos trabajando en esta página!
        </h1>
        <p className='text-center mt-2'>
          Próximamente podrás disfrutar de todas las funcionalidades de esta
          sección.
        </p>
      </div>
    </ScrollArea>
  );
}
