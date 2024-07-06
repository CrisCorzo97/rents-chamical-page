import { createSupabaseServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SupabaseCookie } from '@/types/cookies';
import dbSupabase from '@/lib/prisma/prisma';

const PROJECT_ID = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID;

export async function POST(
  request: NextRequest
): Promise<NextResponse<{ success: boolean; message?: string }>> {
  try {
    const form_data = await request.formData();
    const cookie_store = cookies();

    const new_password = form_data.get('new_password')?.toString();
    const { user }: SupabaseCookie = JSON.parse(
      cookie_store.get(`sb-${PROJECT_ID}-auth-token`)?.value ?? ''
    );

    if (!new_password || !user) {
      return NextResponse.json({
        success: false,
        message:
          'Ocurrió un error al intentar crear tu nueva contraseña. Por favor, intenta nuevamente.',
      });
    }

    const supabase = createSupabaseServerClient(cookie_store);

    const hashed_password = await bcrypt.hash(new_password, 7);

    const { error } = await supabase.auth.updateUser({
      password: new_password,
    });

    if (error) {
      console.error(error);
      return NextResponse.json({
        success: false,
        message:
          'Ocurrió un error al intentar crear tu nueva contraseña. Por favor, intenta nuevamente.',
      });
    }

    await dbSupabase.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashed_password,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message:
        'Ocurrió un error al intentar crear tu nueva contraseña. Por favor, intenta nuevamente.',
    });
  }
}
