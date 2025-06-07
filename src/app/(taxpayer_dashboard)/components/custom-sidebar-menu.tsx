'use client';

import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/cn';
import {
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { BarChart3, FileText, Wallet } from 'lucide-react';

// Elementos del menú
const menuItems: {
  title: string;
  icon: React.ElementType;
  href: string;
}[] = [
  {
    title: 'Resumen',
    icon: BarChart3,
    href: '/resumen',
  },
  {
    title: 'Mis DDJJ',
    icon: FileText,
    href: '/mis-declaraciones',
  },
  {
    title: 'Mis Pagos',
    icon: Wallet,
    href: '/mis-pagos',
  },
];

export const CustomSidebarContent = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { state } = useSidebar();

  return (
    <SidebarContent>
      <SidebarMenu>
        {menuItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              isActive={pathname === item.href}
              tooltip={item.title}
              onClick={() => router.push(item.href)}
              size='lg'
              className={cn(
                'data-[active=true]:bg-primary data-[active=true]:text-primary-foreground [&>svg]:size-6',
                state === 'collapsed' && 'justify-center'
              )}
            >
              <item.icon />
              <span
                className={cn(
                  'transition-all',
                  state === 'collapsed' && 'sr-only'
                )}
              >
                {item.title}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarContent>
  );
};
