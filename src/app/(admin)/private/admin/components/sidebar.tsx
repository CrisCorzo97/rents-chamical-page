'use client';
import { LogoRD, LogoRents } from '@/assets/icons';
import { cn } from '@/lib/cn';
import clsx from 'clsx';
import {
  Building2,
  ChevronLeft,
  Church,
  CircleUserRound,
  LayoutDashboard,
} from 'lucide-react';
import Link from 'next/link';
import { useCallback, useState } from 'react';

const sidebarListStyles = {
  li: {
    className: 'list-none h-12 mt-2 flex items-center',
    a: {
      className:
        'h-full w-full flex items-center rounded transition hover:bg-primary hover:text-primary-foreground',
      icon: 'min-w-14 w-6 h-6 flex items-center justify-center',
      label: '',
    },
  },
};

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const topItems: {
    icon: JSX.Element;
    label: string;
    href: string;
  }[] = [
    {
      icon: <LayoutDashboard className={sidebarListStyles.li.a.icon} />,
      label: 'Tablero',
      href: '#',
    },
    {
      icon: <Building2 className={sidebarListStyles.li.a.icon} />,
      label: 'Inmueble',
      href: '#',
    },
    {
      icon: <Church className={sidebarListStyles.li.a.icon} />,
      label: 'Cementerio',
      href: '#',
    },
  ];

  const bottomItems: {
    icon: JSX.Element;
    label: string;
    href: string;
  }[] = [
    {
      icon: <CircleUserRound className={sidebarListStyles.li.a.icon} />,
      label: 'Cuenta',
      href: '#',
    },
  ];

  const SidebarTab = useCallback(
    ({
      icon,
      label,
      href,
    }: {
      icon: React.ReactNode;
      label: string;
      href: string;
    }) => {
      return (
        <li key={href} className={sidebarListStyles.li.className}>
          <Link href={href} className={sidebarListStyles.li.a.className}>
            {icon}
            <span
              className={cn(
                sidebarListStyles.li.a.label,
                clsx({
                  'transition-all duration-300 opacity-0': !isOpen,
                })
              )}
            >
              {label}
            </span>
          </Link>
        </li>
      );
    },
    [isOpen]
  );

  return (
    <nav
      className={cn(
        'flex flex-col w-56 top-0 left-0 bg-secondary transition-all duration-300',
        clsx({
          'w-16': !isOpen,
        })
      )}
    >
      {/* Logo Section */}
      <header className='relative grow-0'>
        <div className='flex items-center'>
          <span className='min-w-14 flex items-center justify-center'>
            <LogoRD className='w-10' />
          </span>

          <div
            className={cn(
              'w-full flex items-center transition-all duration-300',
              clsx({
                'transition-all duration-300 opacity-0': !isOpen,
              })
            )}
          >
            <LogoRents className='w-32' />
          </div>
        </div>

        <span
          onClick={() => setIsOpen((prev) => !prev)}
          className={cn(
            'w-6 h-6 absolute cursor-pointer top-1/2 -right-4 transition-all duration-300 transform -translate-y-1/2 bg-primary flex items-center justify-center rounded-full',
            {
              'rotate-180': !isOpen,
            }
          )}
        >
          <ChevronLeft className='w-5 h-5 text-primary-foreground' />
        </span>
      </header>

      {/* Sidebar Section */}
      <section className='flex flex-1 flex-col justify-between'>
        <div>
          <ul>
            {topItems.map((item) => (
              <SidebarTab key={item.href} {...item} />
            ))}
          </ul>
        </div>

        {/* Sidebar Bottom Section */}
        <div>
          <ul>
            {bottomItems.map((item) => (
              <SidebarTab key={item.href} {...item} />
            ))}
          </ul>
        </div>
      </section>
    </nav>
  );
};
