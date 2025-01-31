import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AuthCallback() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return redirect('/auth/ingresar');
  }

  if (data.user.user_metadata.role_id === 5) {
    return redirect('/');
  }

  return redirect('/private/admin/receipts');
}
