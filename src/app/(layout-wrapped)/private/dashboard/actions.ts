'use server';

import dbSupabase from '@/lib/prisma/prisma';
import { createSupabaseServerClient } from '@/utils/supabase/server';
import { registration_request } from '@prisma/client';
import dayjs from 'dayjs';
import { cookies } from 'next/headers';
import nodemailer from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';
import bcrypt from 'bcryptjs';

const role_dictionary: Record<string, string> = {
  '1': 'administrador',
  '2': 'prensa',
  '3': 'rentas',
};

export const getAllRegistrationRequests = async (): Promise<
  registration_request[]
> => {
  try {
    const requests = await dbSupabase.registration_request.findMany();

    return requests;
  } catch (error) {
    console.error({ error });
    return [];
  }
};

export const confirmRequest = async (
  registration_request: registration_request
): Promise<{ success: boolean; message?: string }> => {
  try {
    // crear el usuario en supabase
    const cookieStore = cookies();
    const supabase = createSupabaseServerClient(cookieStore);

    const { id, first_name, last_name, email, cuil, role_id } =
      registration_request;
    const automaticPasword = `${first_name.toLowerCase()}-${
      role_dictionary[`${role_id}`]
    }-${dayjs().year()}`;
    const hashedPassword = await bcrypt.hash(automaticPasword, 7);

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
        emailRedirectTo: `${process.env.PROJECT_URL}/auth/cambiar-clave?prev_password=${automaticPasword}`,
      },
    });

    if (error || !data?.user?.id) {
      console.log({ error });
      return {
        success: false,
        message: 'Hubo un error al crear el usuario en el sistema.',
      };
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
      return {
        success: false,
        message: 'Hubo un error al crear el usuario en la base de datos.',
      };
    }

    await dbSupabase.registration_request.update({
      where: {
        id,
      },
      data: {
        status: 'approved',
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error({ error });
    return {
      success: false,
      message: 'Hubo un error de servidor. Por favor, intente nuevamente.',
    };
  }
};

export const rejectRequest = async (
  registration_request: registration_request
): Promise<{ success: boolean; message?: string }> => {
  try {
    const { id, first_name, last_name, email } = registration_request;

    await dbSupabase.registration_request.update({
      where: {
        id,
      },
      data: {
        status: 'rejected',
      },
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.NEXT_SENDER_EMAIL,
        pass: process.env.NEXT_SENDER_PASSWORD,
      },
    });

    const mailOptions: MailOptions = {
      from: process.env.NEXT_SENDER_EMAIL,
      to: email,
      subject: 'Solicitud de alta',
      html: `<p>Hola <b>${first_name} ${last_name}</b>.</p><p>Su solicitud ha rechazada debido a que no cuenta con la autorización correpondiente para el acceso a nuestro sistema.</p><p>Si considera que hubo un error, por favor le pedimos que se acerque al establecimiento municipal para poder resolverlo.</p>`,
    };

    const info = await transporter.sendMail(mailOptions);

    if (!info) {
      return {
        success: false,
        message:
          'Hubo un error al enviar el rechazo de la solicitud. Por favor, intente nuevamente.',
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error({ error });
    return {
      success: false,
      message: 'Hubo un error de servidor. Por favor, intente nuevamente.',
    };
  }
};
