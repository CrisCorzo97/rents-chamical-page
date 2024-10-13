'use server';

import dbSupabase from '@/lib/prisma/prisma';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Envelope } from '@/types/envelope';
import { Prisma, registration_request, role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dayjs from 'dayjs';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import nodemailer from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';

const role_dictionary: Record<string, string> = {
  '1': 'administrador',
  '2': 'prensa',
  '3': 'gerente-rentas',
  '4': 'operador-rentas',
};

export const getUserRoles = async (): Promise<role[]> => {
  const roles = await dbSupabase.role.findMany();

  return roles;
};

export const getAllRegistrationRequests = async (input: {
  limit?: number;
  page?: number;
  order_by?: Prisma.registration_requestOrderByWithRelationInput;
  filter?: Prisma.registration_requestWhereInput;
}): Promise<Envelope<registration_request[]>> => {
  const response: Envelope<registration_request[]> = {
    success: true,
    data: null,
    error: null,
    pagination: null,
  };

  try {
    const inputQuery: Prisma.registration_requestFindManyArgs = {
      take: 5,
      orderBy: {
        created_at: 'desc',
      },
    };

    if (input.filter) {
      inputQuery.where = input.filter;
    }
    if (input.page) {
      inputQuery.skip = (+input.page - 1) * (input?.limit ?? 5);
    }
    if (input.limit) {
      inputQuery.take = +input.limit;
    }
    if (input.order_by) {
      inputQuery.orderBy = input.order_by;
    }

    const registrationRequest = await dbSupabase.registration_request.findMany(
      inputQuery
    );

    const registrationRequestCounted =
      await dbSupabase.registration_request.count({
        where: inputQuery.where,
      });

    response.data = registrationRequest;
    response.pagination = {
      total_pages: Math.ceil(
        registrationRequestCounted / (inputQuery.take ?? 5)
      ),
      total_items: registrationRequestCounted,
      page: input.page ? +input.page : 1,
      limit_per_page: inputQuery.take ?? 5,
    };
  } catch (error) {
    console.error({ error });

    response.success = false;
    response.error = 'Hubo un error al obtener las solicitudes de registro.';
  }

  return response;
};

export const confirmRequest = async (
  registration_request: registration_request
): Promise<{ success: boolean; message?: string }> => {
  try {
    const cookieStore = cookies();
    const supabase = createSupabaseServerClient(cookieStore);

    const { id, first_name, last_name, email, cuil, role_id } =
      registration_request;

    // Generar contraseña automática con el formato: nombre-rol-año
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

    revalidatePath('/private/admin/registration_request');

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

    revalidatePath('/private/admin/registration_request');

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
