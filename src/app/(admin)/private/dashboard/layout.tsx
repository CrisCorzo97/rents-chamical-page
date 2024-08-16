import { NavbarMenuItems } from '@/app/(main)/components/ui/header';
import { LogoRents } from '@/assets/icons';
import { Button } from '@/components/ui';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import Link from 'next/link';

export default async function DashboardPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const items: NavbarMenuItems[] = [
    { label: 'Salir de Rentas', key: '/' }, // cambiar esto por la url a redireccionar
  ];

  return (
    <main className='min-h-screen flex flex-col'>
      <header className='w-full h-12 flex grow-0 items-center justify-center bg-primary'>
        <section className='w-full flex items-center justify-end'>
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
      <section className='flex flex-1 gap-4 h-full'>
        <aside className='max-w-64 py-4 flex flex-col items-center justify-between bg-gray-300'>
          <div className='flex flex-col w-64'>
            <Button variant='outline' className='rounded-none w-full'>
              Cementerio
            </Button>
            <Button variant='outline' className='rounded-none w-full'>
              Inmuebles
            </Button>
          </div>
          <LogoRents height={60} fill='#212121' />
        </aside>
        {children}
      </section>
      <footer className='w-full h-28 bg-primary grow-0' />
    </main>
  );
}
