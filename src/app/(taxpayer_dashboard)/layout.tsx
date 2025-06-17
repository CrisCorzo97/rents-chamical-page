import { ChevronDown, CircleUserRound, LogOut } from 'lucide-react';
import Link from 'next/link';

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { CustomSidebar } from './components/custom-sidebar';
import { TaxpayerDataProvider } from './hooks/useTaxpayerContext';
import { getTaxpayerData } from './lib/get-taxpayer-data';
import { formatName } from '@/lib/formatters';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui';
import { TourProvider } from '@/components/tour/tour-provider';

export default async function TaxpayerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const taxpayerData = await getTaxpayerData();
  return (
    <TourProvider>
      <TaxpayerDataProvider taxpayerData={taxpayerData}>
        <SidebarProvider defaultOpen>
          <CustomSidebar />
          <SidebarInset>
            <header className='flex h-14 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-13'>
              <div className='flex w-full items-center justify-between gap-2 px-4'>
                <SidebarTrigger className='-ml-1' />

                <DropdownMenu>
                  <DropdownMenuTrigger
                    className='flex items-center gap-2 outline-none hover:bg-sidebar-border rounded-lg px-2 py-1 transition-colors'
                    data-tour='datos-contribuyente'
                  >
                    <CircleUserRound size={24} />
                    <div className='flex flex-col items-start'>
                      <span className='text-sm font-medium'>
                        {`${formatName(
                          taxpayerData?.user.user_metadata.first_name ?? '-'
                        )} ${formatName(
                          taxpayerData?.user.user_metadata.last_name ?? '-'
                        )}`}
                      </span>
                      <span className='text-xs text-muted-foreground'>
                        {taxpayerData?.user.user_metadata.tax_id ?? '-'}
                      </span>
                    </div>
                    <ChevronDown className='h-4 w-4' />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side='bottom' align='end'>
                    <DropdownMenuItem asChild>
                      <Link
                        href='/auth/logout'
                        className='rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10'
                      >
                        {/* <Button variant='destructive' size='sm'> */}
                        <LogOut className='h-4 w-4 mr-2' />
                        Cerrar Sesión
                        {/* </Button> */}
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>
            <div className='flex flex-1 bg-zinc-200 flex-col gap-4 p-4 pt-4'>
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </TaxpayerDataProvider>
    </TourProvider>
  );
}
