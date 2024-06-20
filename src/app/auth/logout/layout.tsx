import { createSupabaseServerClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient(cookieStore);
  await supabase.auth.signOut();

  revalidatePath('/', 'layout');
  redirect('/');

  return <>{children}</>;
}
