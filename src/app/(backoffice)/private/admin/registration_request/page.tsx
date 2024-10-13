import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ScrollArea } from '@/components/ui/scroll-area';
import { sortByToState } from '@/lib/table';
import Link from 'next/link';
import {
  getAllRegistrationRequests,
  getUserRoles,
} from './actions.registration-request';
import { RegistrationRequestTable } from './page.client';

export default async function RegistrationRequestPage({
  searchParams,
}: {
  searchParams: {
    page?: number;
    limit?: number;
    sort_by?: string;
    sort_direction?: string;
    filter?: string;
  };
}) {
  const { page, limit, sort_by, sort_direction, filter } = searchParams;

  let order_by = {};

  const sortingState = sortByToState({
    sort_by: sort_by ?? '',
    sort_direction: sort_direction ?? '',
  });

  if (sort_by && sort_direction) {
    order_by = {
      [sort_by]: sort_direction,
    };
  }

  const registrationRequest = await getAllRegistrationRequests({
    page,
    limit,
    order_by,
    filter: {
      first_name: {
        contains: filter,
      },
    },
  });

  const roles = await getUserRoles();

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
            <BreadcrumbPage>Solicitudes de Registro</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <RegistrationRequestTable
        data={registrationRequest}
        sorting={sortingState}
        filter={filter ?? ''}
        roles={roles}
      />
    </ScrollArea>
  );
}
