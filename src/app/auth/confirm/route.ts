import { createSupabaseServerClient } from '@/lib/supabase/server';
import { type EmailOtpType } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const redirect_url = searchParams.get('redirect_to');
  const default_redirect_url = request.nextUrl.clone();
  default_redirect_url.pathname = '/';

  const redirectTo = redirect_url ? redirect_url : default_redirect_url;

  if (token_hash && type) {
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      return NextResponse.redirect(redirectTo);
    }
  }

  // Si no trae los parametros necesarios, redirigir al inicio
  return NextResponse.redirect(default_redirect_url);
}
