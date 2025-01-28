import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Loader2 } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function LogoutPage() {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signOut();
  if (!error) {
    return redirect('/');
  }

  return (
    <div
      style={{ minHeight: '100vh' }}
      className='w-full flex items-center justify-center'
    >
      <Loader2 size={24} className='animate-spin text-primary' />
    </div>
  );
}
