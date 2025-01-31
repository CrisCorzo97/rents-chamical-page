import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AuthTaxpayerCallback({
  searchParams,
}: {
  searchParams: Promise<{
    redirect_to?: string;
  }>;
}) {
  const { redirect_to } = await searchParams;

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return redirect('/auth/portal-contribuyente/ingresar');
  }

  if (data.user.user_metadata.role_id !== 5) {
    return redirect('/');
  }

  return redirect(redirect_to ?? '/');
}
