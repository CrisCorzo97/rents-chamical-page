import { createSupabaseServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function PrivatePageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient(cookieStore);

  // Valido si el usuario está autenticado
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    // Si no está autenticado, lo redirecciono a la página de login
    redirect('/auth/ingresar');
  }

  // Si está autenticado, muestro el contenido de la página
  return <>{children}</>;
}
