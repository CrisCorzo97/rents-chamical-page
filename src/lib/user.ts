'use server';

import dbSupabase from './prisma/prisma';
import { createSupabaseServerClient } from './supabase/server';

export const getUser = async () => {
  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.auth.getUser();

    if (error || !data) {
      throw error;
    }

    const user = await dbSupabase.user.findUnique({
      where: {
        id: data.user.id,
      },
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return user;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error('Error al obtener el usuario');
    }
  }
};
