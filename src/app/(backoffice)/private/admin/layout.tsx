import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Sidebar } from './components';

export default async function AdminPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient(cookieStore);

  // Consulto el rol del usuario
  const { data: userData } = await supabase.auth.getUser();

  const userRole = (userData?.user?.user_metadata.role_id as number) ?? 4;

  return (
    <main className='min-h-screen flex'>
      <Sidebar userRole={userRole} />
      <section className='flex flex-col flex-1 gap-4 h-full'>
        <header className='w-full h-12 flex grow-0 items-center justify-center bg-zinc-300'>
          <section className='w-full flex items-center justify-end'>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href='/' prefetch legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle({
                        className:
                          'bg-neutral-500 text-primary-foreground hover:bg-primary/90',
                      })}
                    >
                      Volver al Inicio
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </section>
        </header>
        {children}
      </section>
    </main>
  );
}
