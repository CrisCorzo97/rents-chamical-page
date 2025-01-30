'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import nodemailer from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';
import dbSupabase from '@/lib/prisma/prisma';
import { Envelope } from '@/types/envelope';
import { role } from '@prisma/client';
import bcrypt from 'bcryptjs';

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const supabase = await createSupabaseServerClient();

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error('Error al iniciar sesión. Por favor intente nuevamente.');
    }

    redirect('/auth/callback');
  } catch (error) {
    console.error(error);

    // Si el error es una redirección, lanzarlo nuevamente
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error;
    }

    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Ha ocurrido un error, por favor intente nuevamente.');
    }
  }
};

export const requestRegistration = async ({
  first_name,
  last_name,
  email,
  cuil,
  role,
}: {
  first_name: string;
  last_name: string;
  email: string;
  cuil: string;
  role: string;
}) => {
  const response: Envelope<{ id: string }> = {
    success: false,
    data: null,
    error: null,
    pagination: null,
  };

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.NEXT_SENDER_EMAIL,
        pass: process.env.NEXT_SENDER_PASSWORD,
      },
    });

    const mailOptions: MailOptions = {
      from: process.env.NEXT_SENDER_EMAIL,
      to: process.env.NEXT_RECEIVER_EMAIL,
      subject: 'Solicitud de alta',
      html: `<p><b>Nombre:</b> ${first_name} ${last_name}</p><p><b>Email:</b> ${email}</p><p><b>CUIL:</b> ${cuil}</p><p><b>Rol:</b> ${role}</p>`,
    };

    const info = await transporter.sendMail(mailOptions);

    if (!info) {
      throw new Error(
        'Hubo un error al enviar la solicitud. Por favor, intente nuevamente.'
      );
    }

    const request_created = await dbSupabase.registration_request.create({
      data: {
        first_name,
        last_name,
        email,
        cuil,
        role: {
          connect: {
            id: Number(role ?? ''),
          },
        },
        status: 'pending',
      },
    });

    if (!request_created) {
      throw new Error(
        'Hubo un error al enviar la solicitud. Por favor, intente nuevamente.'
      );
    }

    response.data = { id: request_created.id };
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

    const supabase = await createSupabaseServerClient();

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
      redirectTo: `${process.env.PROJECT_URL}/auth/recuperar-clave`,
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

export const getRoles = async () => {
  const response: Envelope<role[]> = {
    success: false,
    data: null,
    error: null,
    pagination: null,
  };

  try {
    const roles = await dbSupabase.role.findMany({
      where: {
        role: {
          contains: 'rent',
        },
      },
    });

    if (!roles) {
      throw new Error('No se encontraron roles.');
    }

    response.data = roles;
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
