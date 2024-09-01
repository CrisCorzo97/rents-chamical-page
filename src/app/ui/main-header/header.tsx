import { LogoRents } from '@/assets/icons';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import Link from 'next/link';
import React from 'react';

export type NavbarMenuItems = {
  label: string | React.ReactNode;
  key: string;
};

export const MainHeader = () => {
  const items: NavbarMenuItems[] = [
    { label: 'Salir de Rentas', key: '/' }, // cambiar esto por la url a redireccionar
  ];

  return (
    <header className='w-full h-20 flex grow-0 items-center justify-center bg-primary'>
      <section className='max-w-6xl w-full flex items-center justify-between'>
        <LogoRents height={60} fill='#fff' />

        <NavigationMenu>
          <NavigationMenuList>
            {items.map((item) => (
              <NavigationMenuItem key={item.key}>
                <Link href={item.key} prefetch legacyBehavior passHref>
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle({
                      className:
                        'bg-primary text-primary-foreground hover:bg-primary/90',
                    })}
                  >
                    {item.label}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </section>
    </header>
  );
};
