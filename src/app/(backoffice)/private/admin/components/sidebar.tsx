'use client';
import { LogoRD, LogoRents } from '@/assets/icons';
import { cn } from '@/lib/cn';
import clsx from 'clsx';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { SIDEBAR_TABS_BY_ROLE } from '../constants';

const sidebarListStyles = {
  li: {
    className: 'list-none h-12 mt-2 flex items-center',
    a: {
      className:
        'h-full w-full flex items-center rounded transition hover:bg-primary hover:text-primary-foreground',
      icon: 'min-w-14 w-6 h-6 flex items-center justify-center',
    },
  },
};

export const Sidebar = ({ userRole }: { userRole: number }) => {
  const [isOpen, setIsOpen] = useState(true);

  const { topItems, bottomItems } = useMemo(() => {
    const topItems = SIDEBAR_TABS_BY_ROLE[userRole].top.map((item) => ({
      ...item,
      icon: <span className={sidebarListStyles.li.a.icon}>{item.icon}</span>,
    }));

    const bottomItems = SIDEBAR_TABS_BY_ROLE[userRole].bottom.map((item) => ({
      ...item,
      icon: <span className={sidebarListStyles.li.a.icon}>{item.icon}</span>,
    }));

    return {
      topItems,
      bottomItems,
    };
  }, [userRole]);

  return (
    <nav
      className={cn(
        'flex flex-col w-56 top-0 left-0 bg-secondary border-r-2 transition-all duration-300',
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
              {
                'opacity-0': !isOpen,
              }
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
      <section className='flex flex-1 flex-col justify-between mb-4'>
        <div>
          <ul>
            {topItems.map((item) => (
              <li key={item.id} className={sidebarListStyles.li.className}>
                <Link
                  href={item.href}
                  className={sidebarListStyles.li.a.className}
                >
                  {item.icon}
                  <span
                    className={`transition-opacity ${
                      isOpen ? 'duration-500 opacity-100' : 'opacity-0'
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Sidebar Bottom Section */}
        <div>
          <ul>
            {bottomItems.map((item) => (
              <li key={item.id} className={sidebarListStyles.li.className}>
                <Link
                  href={item.href}
                  className={sidebarListStyles.li.a.className}
                >
                  {item.icon}
                  <span
                    className={`transition-opacity ${
                      isOpen ? 'duration-500 opacity-100' : 'opacity-0'
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </nav>
  );
};
