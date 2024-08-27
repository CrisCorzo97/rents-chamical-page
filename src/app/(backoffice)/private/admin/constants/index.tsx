import {
  Building2,
  Church,
  CircleUserRound,
  LayoutDashboard,
} from 'lucide-react';

export type SidebarTab = {
  id: string;
  icon: React.ReactNode;
  label: string;
  href: string;
};

export const SIDEBAR_TABS_BY_ROLE: Record<
  string,
  { top: SidebarTab[]; bottom: SidebarTab[] }
> = {
  '1': {
    top: [
      {
        id: 'dashboard',
        icon: <LayoutDashboard />,
        label: 'Tablero',
        href: '/private/admin/dashboard',
      },
      {
        id: 'property',
        icon: <Building2 />,
        label: 'Inmueble',
        href: '/private/admin/property',
      },
      {
        id: 'cementery',
        icon: <Church />,
        label: 'Cementerio',
        href: '/private/admin/cementery',
      },
    ],
    bottom: [
      {
        id: 'account',
        icon: <CircleUserRound />,
        label: 'Cuenta',
        href: '/private/admin/account',
      },
    ],
  },
  '2': { top: [], bottom: [] },
  '3': { top: [], bottom: [] },
  '4': { top: [], bottom: [] },
};
