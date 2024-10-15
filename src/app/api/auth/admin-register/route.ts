import dbSupabase from '@/lib/prisma/prisma';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { user } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const body = Object.fromEntries(formData.entries());

  if (!body) {
    return NextResponse.json({ error: 'Missing body' }, { status: 400 });
  }

  const { first_name, last_name, email, cuil, role_id, password } =
    body as unknown as user;

  if (!first_name || !last_name || !email || !cuil || !role_id || !password) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  try {
    const cookieStore = cookies();
    const supabase = createSupabaseServerClient(cookieStore);

    const hashedPassword = await bcrypt.hash(password, 7);

    const { error, data } = await supabase.auth.signUp({
      email,
      password: hashedPassword,
      options: {
        data: {
          first_name,
          last_name,
          cuil,
          role_id: Number(role_id),
        },
        emailRedirectTo: `${
          process.env.PROJECT_URL ?? 'rentas.municipalidadchamical.gob.ar'
        }/auth/cambiar-clave?prev_password=${password}`,
      },
    });

    if (error || !data?.user?.id) {
      console.log({ error });
      return NextResponse.json(
        { error: 'Error creating supabase user' },
        { status: 500 }
      );
    }

    const created = await dbSupabase.user.create({
      data: {
        id: data.user.id,
        first_name,
        last_name,
        email,
        password: hashedPassword,
        cuil,
        role_id: Number(role_id),
      },
    });

    if (!created) {
      return NextResponse.json(
        { error: 'Error creating public user' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'User created successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error creating user' }, { status: 500 });
  }
}
