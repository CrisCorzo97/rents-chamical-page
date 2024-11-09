'use client';
import { createSupabaseClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AuthCallback() {
  const supabase = createSupabaseClient();
  const router = useRouter();

  supabase.auth.getUser().then(({ data, error }) => {
    if (error || !data.user) {
      router.replace('/auth/ingresar');
    }

    router.replace('/private/admin/receipts');
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
