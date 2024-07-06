import { createSupabaseClient } from '@/lib/supabase/client';
import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

export function useContextInit() {
  const [session, setSession] = useState<Session | null>(null);

  const supabase = createSupabaseClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setSession(session);
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
      } else if (session) {
        setSession(session);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  return { session };
}
