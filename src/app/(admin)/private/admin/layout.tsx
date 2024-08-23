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
import { Sidebar } from './components/sidebar';

export default async function AdminPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient(cookieStore);

  // Consulto el rol del usuario
  const { data: userData } = await supabase.auth.getUser();

  const userRole = userData?.user?.user_metadata.role_id;

  return (
    <main className='min-h-screen flex'>
      <Sidebar />
      <section className='flex flex-col flex-1 gap-4 h-full'>
        <header className='w-full h-12 flex grow-0 items-center justify-center bg-primary'>
          <section className='w-full flex items-center justify-end'>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href='/' prefetch legacyBehavior passHref>
                    {/*Cambiar el HREF por la URL correspondiente */}
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle({
                        className:
                          'bg-primary text-primary-foreground hover:bg-primary/90',
                      })}
                    >
                      Salir de Rentas
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
