import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function GET() {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error(error);
    throw error;
  }

  revalidatePath('/', 'page');
  revalidatePath('/private/admin', 'layout');
  redirect('/');
}
