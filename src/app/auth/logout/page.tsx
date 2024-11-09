'use client';
import { createSupabaseClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const supabase = createSupabaseClient();
  const router = useRouter();

  supabase.auth.signOut().then(({ error }) => {
    if (!error) {
      router.replace('/');
    }
  });

  return (
    <div
      style={{ minHeight: '100vh' }}
      className='w-full flex items-center justify-center'
    >
      <Loader2 size={24} className='animate-spin text-primary' />
    </div>
  );
}
