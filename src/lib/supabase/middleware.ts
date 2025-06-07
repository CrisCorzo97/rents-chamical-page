import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Rutas protegidas que requieren autenticación de contribuyente (role_id = 5)
const taxpayerProtectedRoutes = [
  '/tramites/DDJJ-actividad-comercial',
  '/resumen',
  '/mis-declaraciones',
  '/mis-pagos',
  '/mi-cuenta',
];

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
    const isTaxpayerRoute = taxpayerProtectedRoutes.some((route) =>
      request.nextUrl.pathname.startsWith(route)
    );

    let url = request.nextUrl.clone();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const isLogged = !!user;
    const isTaxpayerUser = isLogged && user.user_metadata.role_id === 5;

    // Redirigir usuarios no autenticados
    if (!isLogged && (isAdminRoute || isTaxpayerRoute)) {
      url.pathname = isAdminRoute
        ? '/auth/ingresar'
        : '/auth/portal-contribuyente/ingresar';
      return NextResponse.redirect(url);
    }

    // Redirigir usuarios autenticados pero sin los permisos correctos
    if (isLogged && isAdminRoute && isTaxpayerUser) {
      url.pathname = '/auth/ingresar';
      return NextResponse.redirect(url);
    }

    if (isLogged && isTaxpayerRoute && !isTaxpayerUser) {
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
