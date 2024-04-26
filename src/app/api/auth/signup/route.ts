import { NextRequest, NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createSupabaseServerClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function POST(
  request: NextRequest
): Promise<NextResponse<{ success: boolean; message: string }>> {
  // return NextResponse.json({ success: false, error: 'Ahhhhhh' });
  try {
    const form_data = await request.formData();
    const cookieStore = cookies();
    const supabase = createSupabaseServerClient(cookieStore);

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
      email: form_data.get('email') as string,
      password: form_data.get('password') as string,
    };

    const { error } = await supabase.auth.signUp(data);

    if (error) {
      redirect('/error');
    }

    revalidatePath('/', 'layout');
    redirect('/');
  } catch (error) {
    console.error(error);
    return redirect('/auth/error');
  }
}
