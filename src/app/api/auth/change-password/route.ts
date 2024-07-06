import dbSupabase from '@/lib/prisma/prisma';
import { SupabaseCookie } from '@/types/cookies';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const PROJECT_ID = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID;

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
    const form_data = await request.formData();
    const cookie_store = cookies();

    const { user }: SupabaseCookie = JSON.parse(
      cookie_store.get(`sb-${PROJECT_ID}-auth-token`)?.value ?? ''
    );

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

    const supabase = createSupabaseServerClient(cookie_store);

    const hashed_password = await bcrypt.hash(new_password.toString(), 7);

    const { data, error } = await supabase.auth.admin.updateUserById(
      user_id.toString(),
      {
        password: new_password.toString(),
      }
    );

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
