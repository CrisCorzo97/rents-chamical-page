import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath, unstable_noStore } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET() {
  unstable_noStore();

  const cookieStore = cookies();
  const supabase = createSupabaseServerClient(cookieStore);

  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error(error);
    throw error;
  }

  revalidatePath('/');
  redirect('/');
}
