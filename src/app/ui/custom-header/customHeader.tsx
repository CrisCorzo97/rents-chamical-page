import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { useContextInit } from '@/context/contextInit';
import Link from 'next/link';
import React, { useMemo } from 'react';

export type NavbarMenuItems = {
  label: string | React.ReactNode;
  key: string;
};

export const CustomHeader = () => {
  // const pathname = usePathname();
  const isLogged = useContextInit().session !== null;

  // const supabase = createSupabaseClient();

  // const handleLogout = useCallback(async () => {
  //   await supabase.auth.signOut({ scope: 'local' });
  // }, [supabase.auth]);

  const items: NavbarMenuItems[] = useMemo(() => {
    const lastButton: NavbarMenuItems = isLogged
      ? {
          label: 'Panel Administrativo',
          key: '/private/admin/dashboard',
        }
      : { label: 'Ingresar', key: '/auth/ingresar' };

    return [lastButton];
  }, [isLogged]);

  // const currentPath = useMemo(() => {
  //   if (pathname === '/') return '/';

  //   const filtered = items.filter((item) => item?.key !== '/');

  //   const pathFounded = filtered.find(
  //     (item) => !!item && !!item.key && pathname.includes(item.key as string)
  //   )?.key;

  //   return pathFounded ?? '/';
  // }, [pathname, items]);

  return (
    <nav className='w-full h-16 flex items-center justify-center bg-primary'>
      <div className='max-w-screen-lg w-full flex items-center justify-between'>
        <Avatar>
          <AvatarImage src='https://github.com/shadcn.png' />
          <AvatarFallback>LOGO</AvatarFallback>
        </Avatar>

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
      </div>
    </nav>
  );
};
