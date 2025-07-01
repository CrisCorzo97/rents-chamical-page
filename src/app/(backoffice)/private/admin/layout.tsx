import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Sidebar } from './components';

export default async function AdminPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect('/auth/ingresar');
  }

  // Consulto el rol del usuario
  const userRole = (data?.user?.user_metadata.role_id as number) ?? 4;

  return (
    <main className='min-h-screen flex'>
      <Sidebar userRole={userRole} />
      <section className='flex flex-col flex-1 gap-4 h-full'>
        <header className='w-full h-12 flex grow-0 items-center justify-center bg-zinc-300'>
          <section className='w-full flex items-center justify-end'>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href='/' prefetch passHref legacyBehavior>
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
