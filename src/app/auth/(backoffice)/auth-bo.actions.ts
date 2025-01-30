'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import nodemailer from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';
import dbSupabase from '@/lib/prisma/prisma';
import { Envelope } from '@/types/envelope';
import { role } from '@prisma/client';

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
