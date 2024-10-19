import {
  Building2,
  Church,
  LayoutDashboard,
  LogOut,
  ReceiptText,
  UserRoundCheck,
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
        label: 'Dashboard',
        href: '/private/admin/dashboard',
      },
      {
        id: 'receipts',
        icon: <ReceiptText />,
        label: 'Comprobantes',
        href: '/private/admin/receipts',
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
        id: 'registration_request',
        icon: <UserRoundCheck />,
        label: 'Solicitudes de registro',
        href: '/private/admin/registration_request',
      },
      {
        id: 'account',
        icon: <LogOut />,
        label: 'Cerrar sesión',
        href: '/auth/logout',
      },
    ],
  },
  '2': {
    top: [
      {
        id: 'dashboard',
        icon: <LayoutDashboard />,
        label: 'Dashboard',
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
        icon: <LogOut />,
        label: 'Cerrar sesión',
        href: '/auth/logout',
      },
    ],
  },
  '3': {
    top: [
      {
        id: 'dashboard',
        icon: <LayoutDashboard />,
        label: 'Dashboard',
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
        icon: <LogOut />,
        label: 'Cerrar sesión',
        href: '/auth/logout',
      },
    ],
  },
  '4': {
    top: [
      {
        id: 'dashboard',
        icon: <LayoutDashboard />,
        label: 'Dashboard',
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
        icon: <LogOut />,
        label: 'Cerrar sesión',
        href: '/auth/logout',
      },
    ],
  },
};
