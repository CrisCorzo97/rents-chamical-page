import { Button } from '@/components/ui';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { sortByToState } from '@/lib/table';
import { ChevronDown, CirclePlus } from 'lucide-react';
import Link from 'next/link';
import { ConfirmModal, DailyBoxReport } from './components';
import { ReceiptClientPage } from './page.client';
import { getConfirmedReceipts } from './receipt-actions';

export default async function ReceiptPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: number;
    limit?: number;
    sort_by?: string;
    sort_direction?: string;
    filter?: string;
  }>;
}) {
  const { page, limit, sort_by, sort_direction, filter } = await searchParams;

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

  const data = await getConfirmedReceipts({
    page,
    limit,
    order_by,
    filter: {
      taxpayer: {
        contains: filter?.toUpperCase() ?? '',
      },
    },
  });

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
            <BreadcrumbPage>Comprobantes</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <article>
        <h1 className='text-2xl font-bold'>Comprobantes de pago</h1>

        <Card className='mt-6 flex flex-col items-center justify-center border-dashed border-gray-300 '>
          <CardHeader>
            <CardTitle className='text-lg font-semibold'>
              Acciones rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className='flex gap-2 mt-4'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size='lg' className='flex gap-2'>
                  <CirclePlus size={18} />
                  Crear
                  <ChevronDown size={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-full'>
                <DropdownMenuItem>
                  <Link
                    href='/private/admin/receipts/create-various-rates-receipt'
                    prefetch
                    className='w-full'
                  >
                    Tasas diversas
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href='/private/admin/receipts/create-cementery-receipt'
                    prefetch
                    className='w-full'
                  >
                    Cementerio
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href='/private/admin/receipts/create-property-receipt'
                    prefetch
                    className='w-full'
                  >
                    Inmueble
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href='/private/admin/receipts/create-patent-receipt'
                    prefetch
                    className='w-full'
                  >
                    Patente
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <ConfirmModal />

            <DailyBoxReport />
          </CardContent>
        </Card>

        <ReceiptClientPage
          data={data}
          sorting={sortingState}
          filter={filter ?? ''}
        />
      </article>
    </ScrollArea>
  );
}
