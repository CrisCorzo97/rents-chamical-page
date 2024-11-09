import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest
): Promise<NextResponse<{ success: boolean; message?: string }>> {
  try {
    const form_data = await request.formData();
    const supabase = await createSupabaseServerClient();

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const email = form_data.get('email')?.toString();
    const password = form_data.get('password')?.toString();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Faltan datos.' });
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log({ error: error.message });
      return NextResponse.json({
        success: false,
        message: 'Error al iniciar sesión.',
      });
    }

    revalidatePath(request.nextUrl.pathname);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: 'Ha ocurrido un error, por favor intente nuevamente.',
    });
  }
}
