'use client';

import { Sidebar } from '@/components/ui/sidebar';
import { CustomSidebarHeader } from './custom-sidebar-header';
import { CustomSidebarContent } from './custom-sidebar-menu';
import { CustomSidebarFooter } from './custom-sidebar-footer';

export const CustomSidebar = () => {
  return (
    <Sidebar variant='sidebar' collapsible='icon'>
      <CustomSidebarHeader />

      <CustomSidebarContent />

      <CustomSidebarFooter />
    </Sidebar>
  );
};
