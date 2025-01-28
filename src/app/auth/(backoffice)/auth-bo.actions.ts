'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const supabase = await createSupabaseServerClient();

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error('Error al iniciar sesión. Por favor intente nuevamente.');
    }

    redirect('/auth/callback');
  } catch (error) {
    console.error(error);

    // Si el error es una redirección, lanzarlo nuevamente
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error;
    }

    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Ha ocurrido un error, por favor intente nuevamente.');
    }
  }
};
