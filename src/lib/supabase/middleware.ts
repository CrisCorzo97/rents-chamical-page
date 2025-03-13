import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const taxpayerProtectedRoutes = ['/tramites/DDJJ-actividad-comercial'];

export async function updateSession(request: NextRequest) {
  try {
    let supabaseResponse = NextResponse.next({
      request,
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    const isAdminRoute = request.nextUrl.pathname.startsWith('/private');
    const isTaxpayerProtectedRoute = taxpayerProtectedRoutes.includes(
      request.nextUrl.pathname
    );

    let url = request.nextUrl.clone();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const isLogged = !!user;

    const isTaxpayerUser = isLogged && user.user_metadata.role_id === 5;

    if (!isLogged && (isAdminRoute || isTaxpayerProtectedRoute)) {
      url.pathname = isAdminRoute
        ? '/auth/ingresar'
        : '/auth/portal-contribuyente/ingresar';
      return NextResponse.redirect(url);
    }

    if (isLogged && isAdminRoute && isTaxpayerUser) {
      url.pathname = '/auth/ingresar';
      return NextResponse.redirect(url);
    }

    if (isLogged && isTaxpayerProtectedRoute && !isTaxpayerUser) {
      url.pathname = '/auth/portal-contribuyente/ingresar';
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  } catch (error) {
    console.error(error);
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    // Check out http://localhost:3000 for Next Steps.
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
}
