'use client';

import { SidebarHeader, useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/cn';

export const CustomSidebarHeader = () => {
  const { state } = useSidebar();

  return (
    <SidebarHeader
      className={cn(
        'flex items-center justify-between bg-sidebar-primary border-b px-4 py-3',
        state === 'collapsed' && 'justify-center px-2'
      )}
    >
      <div className='flex items-center gap-2 text-sidebar-primary-foreground'>
        <span className='text-lg font-semibold'>
          <span
            className={cn('transition-all', state === 'collapsed' && 'sr-only')}
          >
            Portal del Contribuyente
          </span>
          <span
            className={cn('transition-all', state === 'expanded' && 'sr-only')}
          >
            PC
          </span>
        </span>
      </div>
    </SidebarHeader>
  );
};
