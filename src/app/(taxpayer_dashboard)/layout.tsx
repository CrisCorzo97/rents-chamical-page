import { LogOut } from 'lucide-react';
import Link from 'next/link';

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { CustomSidebar } from './components/custom-sidebar';
import { TaxpayerDataProvider } from './hooks/useTaxpayerContext';
import { getTaxpayerData } from './lib/get-taxpayer-data';

export default async function TaxpayerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const taxpayerData = await getTaxpayerData();
  return (
    <TaxpayerDataProvider taxpayerData={taxpayerData}>
      <SidebarProvider defaultOpen>
        <CustomSidebar />
        <SidebarInset>
          <header className='flex h-13 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-13'>
            <div className='flex w-full items-center justify-between gap-2 px-4'>
              <SidebarTrigger className='-ml-1' />
              <Link
                href='/auth/logout'
                className='rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10'
              >
                <Button variant='destructive' size='sm'>
                  <LogOut className='h-4 w-4 mr-2' />
                  Cerrar Sesión
                </Button>
              </Link>
            </div>
          </header>
          <div className='flex flex-1 bg-zinc-200 flex-col gap-4 p-4 pt-4'>
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TaxpayerDataProvider>
  );
}
