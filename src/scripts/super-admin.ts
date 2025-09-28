import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const updateUserEmailByUserId = async (userId: string, email: string) => {
  console.log(`Intentando actualizar email para usuario ${userId} a ${email}`);

  try {
    const { data, error } = await supabase.auth.admin.updateUserById(userId, {
      email,
    });

    if (error) {
      console.error('Error al actualizar email:', error.message);
      throw error;
    }

    console.log('Email actualizado exitosamente:', {
      authData: data,
    });

    try {
      const { data: userData } = await supabase
        .from('user')
        .update({
          email,
        })
        .eq('id', userId)
        .select('*');

      console.log(
        'Email actualizado exitosamente en la base de datos:',
        userData
      );
    } catch (userError: any) {
      console.error(
        'Error al actualizar email en la base de datos:',
        userError.message
      );
      throw userError;
    }

    return data;
  } catch (err) {
    console.error('Error inesperado al actualizar email:', err);
    throw err;
  }
};

updateUserEmailByUserId(
  '6a8b1895-b96f-4258-82c9-b43040cbe1c4',
  'reina_b+analia@hotmail.com.ar'
);
