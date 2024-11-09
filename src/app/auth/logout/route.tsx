import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath, unstable_noStore } from 'next/cache';
import { redirect } from 'next/navigation';

export async function GET() {
  unstable_noStore();
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error(error);
    throw error;
  }

  revalidatePath('/');
  redirect('/');
}
