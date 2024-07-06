import dbSupabase from '@/lib/prisma/prisma';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export const verifyPassword = async ({
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

export const changePassword = async (input: {
  user_id: string;
  old_password: string;
  new_password: string;
}): Promise<void> => {
  const { user_id, old_password, new_password } = input;

  try {
    const isPasswordValid = await verifyPassword({
      user_id,
      prev_password: old_password,
    });

    if (!isPasswordValid) {
      return;
    }

    const cookie_store = cookies();
    const supabase = createSupabaseServerClient(cookie_store);

    const hashed_password = await bcrypt.hash(new_password, 7);

    const { data, error } = await supabase.auth.admin.updateUserById(user_id, {
      password: hashed_password,
    });

    if (error || !data) {
      console.log({ error });
      return;
    }

    await dbSupabase.user.update({
      where: {
        id: user_id,
      },
      data: {
        password: hashed_password,
      },
    });

    return;
  } catch (error) {
    console.log({ error });
    return;
  }
};
