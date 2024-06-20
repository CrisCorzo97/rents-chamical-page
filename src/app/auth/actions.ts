import { createSupabaseServerClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const cookieStore = cookies();
const supabase = createSupabaseServerClient(cookieStore);

export async function logout() {
  await supabase.auth.signOut();

  revalidatePath('/', 'layout');
  redirect('/');
}
