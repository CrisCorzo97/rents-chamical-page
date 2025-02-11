'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Envelope } from '@/types/envelope';
import dbSupabase from '@/lib/prisma/prisma';
import bcrypt from 'bcryptjs';
import { verifyPassword } from '../../(backoffice)/auth-bo.actions';

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<Envelope<{ redirectUrl: string }>> => {
  const response: Envelope<{ redirectUrl: string }> = {
    success: false,
    data: null,
    error: null,
    pagination: null,
  };

  try {
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log({ error });
      throw new Error('Error al iniciar sesión. Por favor intente nuevamente.');
    }

    response.success = true;
    response.data = { redirectUrl: '/auth/portal-contribuyente/callback' };
  } catch (error) {
    console.error(error);
    response.success = false;

    if (error instanceof Error) {
      response.error = error.message;
    } else {
      response.error = 'Ha ocurrido un error, por favor intente nuevamente.';
    }
  } finally {
    return response;
  }
};

export const signup = async ({
  first_name,
  last_name,
  email,
  tax_id,
  password,
}: {
  first_name: string;
  last_name: string;
  email: string;
  tax_id: string;
  password: string;
}): Promise<Envelope<null>> => {
  const response: Envelope<null> = {
    success: false,
    data: null,
    error: null,
    pagination: null,
  };

  try {
    const supabase = await createSupabaseServerClient();

    const hashedPassword = await bcrypt.hash(password, 7);

    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name,
          last_name,
          tax_id,
          role_id: 5,
        },
        emailRedirectTo: `${process.env.PROJECT_URL}/auth/portal-contribuyente/ingresar`,
      },
    });

    if (error || !data?.user?.id) {
      console.log({ error });
      throw new Error('Hubo un error al crear el usuario en el sistema.');
    }

    const created = await dbSupabase.user.create({
      data: {
        id: data.user.id,
        first_name,
        last_name,
        email,
        password: hashedPassword,
        cuil: tax_id,
        role_id: 5,
      },
    });

    if (!created) {
      throw new Error('Hubo un error al crear el usuario en la base de datos.');
    }

    response.success = true;
  } catch (error) {
    console.error(error);
    response.success = false;

    if (error instanceof Error) {
      response.error = error.message;
    } else {
      response.error = 'Ha ocurrido un error, por favor intente nuevamente.';
    }
  } finally {
    return response;
  }
};

export const requestPasswordRecovery = async ({
  email,
}: {
  email: string;
}): Promise<Envelope<null>> => {
  const response: Envelope<null> = {
    success: false,
    data: null,
    error: null,
    pagination: null,
  };

  try {
    const user = await dbSupabase.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error(
        'Ocurrió un error al intentar recuperar tu contraseña. Por favor, intenta nuevamente.'
      );
    }

    const supabase = await createSupabaseServerClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.PROJECT_URL}/auth/portal-contribuyente/recuperar-contrasena?setPassword=true`,
    });

    if (error) {
      console.error(error);
      throw new Error(
        'Ocurrió un error al intentar recuperar tu contraseña. Por favor, intenta nuevamente.'
      );
    }

    response.success = true;
  } catch (error) {
    console.error(error);
    response.success = false;

    if (error instanceof Error) {
      response.error = error.message;
    } else {
      response.error = 'Ha ocurrido un error, por favor intente nuevamente.';
    }
  } finally {
    return response;
  }
};

export const resetPassword = async ({
  newPassword,
}: {
  newPassword: string;
}): Promise<Envelope<null>> => {
  const response: Envelope<null> = {
    success: false,
    data: null,
    error: null,
    pagination: null,
  };

  try {
    const supabase = await createSupabaseServerClient();

    const { data, error: user_error } = await supabase.auth.getUser();

    if (user_error || !data) {
      throw new Error(
        'Ocurrió un error al intentar crear tu nueva contraseña. Por favor, intenta nuevamente.'
      );
    }

    const hashed_password = await bcrypt.hash(newPassword, 7);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error(error);
      throw new Error(
        'Ocurrió un error al intentar crear tu nueva contraseña. Por favor, intenta nuevamente.'
      );
    }

    await dbSupabase.user.update({
      where: {
        id: data.user.id,
      },
      data: {
        password: hashed_password,
      },
    });

    response.success = true;
  } catch (error) {
    console.error(error);
    response.success = false;

    if (error instanceof Error) {
      response.error = error.message;
    } else {
      response.error = 'Ha ocurrido un error, por favor intente nuevamente.';
    }
  } finally {
    return response;
  }
};

export const changePassword = async ({
  old_password,
  new_password,
}: {
  old_password: string;
  new_password: string;
}): Promise<Envelope<null>> => {
  const response: Envelope<null> = {
    success: false,
    data: null,
    error: null,
    pagination: null,
  };

  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('No se encontró el usuario.');
    }

    const isPasswordValid = await verifyPassword({
      user_id: user.id,
      prev_password: old_password,
    });

    if (!isPasswordValid) {
      throw new Error('La contraseña actual es incorrecta.');
    }

    const hashed_password = await bcrypt.hash(new_password, 7);

    const { data, error } = await supabase.auth.updateUser({
      password: new_password,
    });

    if (error || !data) {
      throw new Error(
        'Error al actualizar la contraseña. Por favor intente nuevamente.'
      );
    }

    await dbSupabase.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashed_password,
      },
    });

    response.success = true;
  } catch (error) {
    console.error(error);
    response.success = false;

    if (error instanceof Error) {
      response.error = error.message;
    } else {
      response.error = 'Ha ocurrido un error, por favor intente nuevamente.';
    }
  } finally {
    return response;
  }
};
