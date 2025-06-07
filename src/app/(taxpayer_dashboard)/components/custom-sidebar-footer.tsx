import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { CircleUserRound } from 'lucide-react';
import { cn } from '@/lib/cn';

export const CustomSidebarFooter = () => {
  const { state } = useSidebar();
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
              <span className='text-sm font-medium'>Cristian Corzo</span>
              <span className='text-xs text-muted-foreground'>
                20-39886018-8
              </span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
};
