import dbSupabase from '@/lib/prisma/prisma';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

const verifyPassword = async ({
  user_id,
  prev_password,
}: {
  user_id: string;
  prev_password: string;
}) => {
  const user = await dbSupabase.user.findUnique({
    where: {
      id: user_id,
    },
  });

  if (!user) {
    return false;
  }

  const isPasswordValid = await bcrypt.compare(prev_password, user.password);

  return isPasswordValid;
};

export async function POST(
  request: Request
): Promise<NextResponse<{ success: boolean; message?: string }>> {
  try {
    const supabase = await createSupabaseServerClient();
    const form_data = await request.formData();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'Usuario no encontrado.',
      });
    }

    const user_id = user.id;
    const old_password = form_data.get('old_password');
    const new_password = form_data.get('new_password');

    if (!user_id || !old_password || !new_password) {
      return NextResponse.json({ success: false, message: 'Faltan datos.' });
    }

    const isPasswordValid = await verifyPassword({
      user_id: user_id.toString(),
      prev_password: old_password.toString(),
    });

    if (!isPasswordValid) {
      return NextResponse.json({
        success: false,
        message: `Error al cambiar la contraseña. La contraseña no es válida. ${old_password.toString()}`,
      });
    }

    const hashed_password = await bcrypt.hash(new_password.toString(), 7);

    const { data, error } = await supabase.auth.updateUser({
      password: new_password.toString(),
    });

    if (error || !data) {
      console.log({ error });
      return NextResponse.json({
        success: false,
        message: 'Error al cambiar la contraseña. Falló Supabase',
      });
    }

    await dbSupabase.user.update({
      where: {
        id: user_id.toString(),
      },
      data: {
        password: hashed_password,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log({ error });
    return NextResponse.json({
      success: false,
      message: 'Ha ocurrido un error. Por favor, intenta de nuevo.',
    });
  }
}
