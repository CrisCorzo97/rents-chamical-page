import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { CircleUserRound } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useTaxpayerContext } from '../hooks/useTaxpayerContext';
import { formatName } from '@/lib/formatters';

export const CustomSidebarFooter = () => {
  const { state } = useSidebar();
  const taxpayerData = useTaxpayerContext();

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size='lg'
            className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground [&>svg]:size-6'
          >
            <CircleUserRound />
            <div
              className={cn(
                'flex flex-col transition-all duration-1000',
                state === 'collapsed' && 'sr-only duration-0'
              )}
            >
              <span className='text-sm font-medium'>
                {`${formatName(
                  taxpayerData?.user.user_metadata.first_name ?? '-'
                )} ${formatName(
                  taxpayerData?.user.user_metadata.last_name ?? ''
                )}`}
              </span>
              <span className='text-xs text-muted-foreground'>
                {taxpayerData?.user.user_metadata.tax_id ?? '-'}
              </span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
};
