import dbSupabase from '@/lib/prisma/prisma';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest
): Promise<NextResponse<{ success: boolean; message?: string }>> {
  try {
    const form_data = await request.formData();

    const email = form_data.get('email')?.toString();

    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'El correo electrónico es requerido.',
      });
    }

    const user = await dbSupabase.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        message:
          'Ocurrió un error al intentar recuperar tu contraseña. Por favor, intenta nuevamente.',
      });
    }

    const cookie_store = cookies();
    const supabase = createSupabaseServerClient(cookie_store);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.PROJECT_URL}/auth/recuperar-clave`,
    });

    if (error) {
      console.error(error);
      return NextResponse.json({
        success: false,
        message:
          'Ocurrió un error al intentar recuperar tu contraseña. Por favor, intenta nuevamente.',
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message:
        'Ocurrió un error al intentar recuperar tu contraseña. Por favor, intenta nuevamente.',
    });
  }
}
