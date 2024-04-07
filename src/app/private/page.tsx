import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { createSupabaseServerClient } from '@/utils/supabase/server';
import { logout } from '../../lib/auth/actions';

export default async function PrivatePage() {
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient(cookieStore);

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect('/');
  }

  return (
    <div>
      <p>Hello {data.user.email}</p>
      <form>
        <button formAction={logout}>Sign out</button>
      </form>
    </div>
  );
}
