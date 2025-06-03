import { Metadata } from 'next';
import { ReceiptsTable } from './receipts-table';
import { getReceipts } from './receipt-actions';
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
import { CirclePlus, ChevronDown } from 'lucide-react';
import {
  Button,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import { DailyBoxReport } from './components/dailyBoxReport';
import { ConfirmModal } from './components/confirmModal';

export const metadata: Metadata = {
  title: 'Comprobantes de Pago',
  description: 'Gestión de comprobantes de pago',
};

export default async function ReceiptsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const {
    page,
    limit,
    sort_by,
    sort_direction,
    'filter.id': id,
    'filter.taxpayer': taxpayer,
  } = await searchParams;

  const { data, pagination } = await getReceipts({
    page: typeof page === 'string' ? parseInt(page) : undefined,
    limit: typeof limit === 'string' ? parseInt(limit) : 8,
    sort_by: typeof sort_by === 'string' ? sort_by : undefined,
    sort_direction:
      typeof sort_direction === 'string'
        ? (sort_direction as 'asc' | 'desc')
        : undefined,
    filters:
      id || taxpayer
        ? {
            id: id as string,
            taxpayer: taxpayer as string,
          }
        : undefined,
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
            <BreadcrumbPage>Comprobantes de Pago</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <article className='pr-3 mb-10'>
        <Card className='my-4 flex flex-col items-center justify-center border-dashed border-gray-300 '>
          <CardHeader>
            <CardTitle className='text-lg font-semibold'>
              Acciones rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className='flex gap-2'>
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
                    href='/private/admin/receipts/create-commercial-enablement-receipt'
                    prefetch
                    className='w-full'
                  >
                    Habilitación comercial
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

        <ReceiptsTable items={data ?? []} pagination={pagination} />
      </article>
    </ScrollArea>
  );
}
