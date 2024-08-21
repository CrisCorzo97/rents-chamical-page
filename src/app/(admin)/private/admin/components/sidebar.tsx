import { LogoRD, LogoRents } from '@/assets/icons';
import { cn } from '@/lib/cn';
import { Building2, ChevronRight, Church, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

const sidebarListStyles = {
  li: {
    className: 'list-none h-12 mt-2 flex items-center',
    a: {
      className:
        'h-full w-full flex items-center rounded transition hover:bg-primary hover:text-primary-foreground',
      icon: 'w-5 h-5',
    },
  },
};

export const Sidebar = () => {
  return (
    <nav
      className={cn('fixed w-56 top-0 left-0 h-screen bg-secondary', 'w-20')}
    >
      {/* Logo Section */}
      <header className='relative'>
        <div className='flex items-center'>
          <span className='min-w-14 flex items-center justify-center'>
            <LogoRD className='w-10' />
          </span>

          <div className='w-full flex items-center'>
            <LogoRents className='w-32' />
          </div>
        </div>

        <span className='w-6 h-6 absolute top-1/2 -right-4 transform -translate-y-1/2 bg-primary flex items-center justify-center rounded-full'>
          <ChevronRight className='w-5 h-5 text-primary-foreground' />
        </span>
      </header>

      {/* Sidebar Section */}
      <section className='h-full flex flex-col justify-between'>
        <div>
          <ul>
            <li className={sidebarListStyles.li.className}>
              <Link href='#' className={sidebarListStyles.li.a.className}>
                <LayoutDashboard className={sidebarListStyles.li.a.icon} />
                <span>Tablero</span>
              </Link>
            </li>
            <li className={sidebarListStyles.li.className}>
              <Link href='#' className={sidebarListStyles.li.a.className}>
                <Building2 className={sidebarListStyles.li.a.icon} />
                <span>Inmueble</span>
              </Link>
            </li>
            <li className={sidebarListStyles.li.className}>
              <Link href='#' className={sidebarListStyles.li.a.className}>
                <Church className={sidebarListStyles.li.a.icon} />
                <span>Cementerio</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Sidebar Bottom Section */}
        <div>
          <ul>
            <li className={sidebarListStyles.li.className}>
              <Link href='#' className={sidebarListStyles.li.a.className}>
                <LayoutDashboard className={sidebarListStyles.li.a.icon} />
                <span>Tablero</span>
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </nav>
  );
};
