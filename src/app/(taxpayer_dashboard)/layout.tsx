import { LogOut } from 'lucide-react';
import Link from 'next/link';

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { CustomSidebar } from './components/custom-sidebar';

export default function TaxpayerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen>
      <CustomSidebar />

      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'>
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
        <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
