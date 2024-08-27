'use server';

import dbSupabase from '@/lib/prisma/prisma';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Envelope } from '@/types/envelope';
import {
  Prisma,
  burial_type,
  cementery,
  cementery_place,
  city_section,
  neighborhood,
  property,
  registration_request,
} from '@prisma/client';
import bcrypt from 'bcryptjs';
import dayjs from 'dayjs';
import { cookies } from 'next/headers';
import nodemailer from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';

const role_dictionary: Record<string, string> = {
  '1': 'administrador',
  '2': 'prensa',
  '3': 'gerente-rentas',
  '4': 'operador-rentas',
};

/* --- ACCIONES DE LOS REGISTROS DE INMUEBLES --- */
export const getProperties = async (input: {
  limit?: number;
  page?: number;
  order_by?: Prisma.propertyOrderByWithRelationInput;
  filter?: Prisma.propertyWhereInput;
}): Promise<Envelope<property[]>> => {
  const response: Envelope<property[]> = {
    success: true,
    data: null,
    pagination: null,
  };
  try {
    const inputQuery: Prisma.propertyFindManyArgs = {
      take: 10,
      orderBy: {
        taxpayer: 'asc',
      },
    };

    if (input.filter) {
      inputQuery.where = input.filter;
    }
    if (input.limit) {
      inputQuery.take = input.limit;
    }
    if (input.page) {
      inputQuery.skip = input.page;
    }
    if (input.order_by) {
      inputQuery.orderBy = input.order_by;
    }

    const properties = await dbSupabase.property.findMany(inputQuery);

    const propertiesCounted = await dbSupabase.property.count({
      where: inputQuery.where,
    });

    response.data = properties;
    response.pagination = {
      total_pages: Math.ceil(propertiesCounted / (input.limit || 10)),
      total_items: propertiesCounted,
      page: input.page || 1,
      limit_per_page: input.limit || 10,
    };

    return response;
  } catch (error) {
    console.error({ error });

    response.success = false;
    response.error = 'Hubo un error al obtener los registros de inmuebles.';

    return response;
  }
};

/* --- ACCIONES DE LOS REGISTROS DE CEMENTERIO --- */
export const getCementeryRecords = async (input: {
  limit?: number;
  page?: number;
  order_by?: Prisma.cementeryOrderByWithRelationInput;
  filter?: Prisma.cementeryWhereInput;
}): Promise<Envelope<cementery[]>> => {
  const response: Envelope<cementery[]> = {
    success: true,
    data: null,
    pagination: null,
  };
  try {
    const inputQuery: Prisma.cementeryFindManyArgs = {
      take: 10,
      orderBy: {
        taxpayer: 'asc',
      },
    };

    if (input.filter) {
      inputQuery.where = input.filter;
    }
    if (input.limit) {
      inputQuery.take = input.limit;
    }
    if (input.page) {
      inputQuery.skip = input.page;
    }
    if (input.order_by) {
      inputQuery.orderBy = input.order_by;
    }

    const cementeryRecords = await dbSupabase.cementery.findMany(inputQuery);

    const cementeryRecordsCounted = await dbSupabase.cementery.count();

    response.data = cementeryRecords;
    response.pagination = {
      total_pages: Math.ceil(cementeryRecordsCounted / (input.limit || 10)),
      total_items: cementeryRecordsCounted,
      page: input.page || 1,
      limit_per_page: input.limit || 10,
    };

    return response;
  } catch (error) {
    console.error({ error });

    response.success = false;
    response.error = 'Hubo un error al obtener los registros de cementerio.';

    return response;
  }
};

/* --- ACCIONES DE LAS SECCIONES DE LA CIUDAD --- */
export const getCitySections = async (): Promise<Envelope<city_section[]>> => {
  const response: Envelope<city_section[]> = {
    success: true,
    data: null,
    pagination: null,
  };
  try {
    const citySections = await dbSupabase.city_section.findMany();

    response.data = citySections;

    return response;
  } catch (error) {
    console.error({ error });

    response.success = false;
    response.error = 'Hubo un error al obtener las secciones de la ciudad.';

    return response;
  }
};

/* --- ACCIONES DE LOS BARRIOS --- */
export const getNeighborhoods = async (): Promise<Envelope<neighborhood[]>> => {
  const response: Envelope<neighborhood[]> = {
    success: true,
    data: null,
    pagination: null,
  };
  try {
    const neighborhoods = await dbSupabase.neighborhood.findMany();

    response.data = neighborhoods;

    return response;
  } catch (error) {
    console.error({ error });

    response.success = false;
    response.error = 'Hubo un error al obtener los barrios.';

    return response;
  }
};

export const addNeighborhood = async (input: {
  name: string;
}): Promise<Envelope<string>> => {
  const response: Envelope<string> = {
    success: true,
    data: null,
    pagination: null,
  };
  try {
    const created = await dbSupabase.neighborhood.create({
      data: {
        name: input.name,
      },
    });

    if (!created) {
      response.success = false;
      response.error = 'Hubo un error al crear el barrio.';
      return response;
    }

    response.data = 'Barrio creado con éxito.';

    return response;
  } catch (error) {
    console.error({ error });

    response.success = false;
    response.error = 'Hubo un error al crear el barrio.';

    return response;
  }
};

export const updateNeighborhood = async (input: {
  id: number;
  name: string;
}): Promise<Envelope<string>> => {
  const response: Envelope<string> = {
    success: true,
    data: null,
    pagination: null,
  };
  try {
    const updated = await dbSupabase.neighborhood.update({
      where: {
        id: input.id,
      },
      data: {
        name: input.name,
      },
    });

    if (!updated) {
      response.success = false;
      response.error = 'Hubo un error al actualizar el barrio.';
      return response;
    }

    response.data = 'Barrio actualizado con éxito.';

    return response;
  } catch (error) {
    console.error({ error });

    response.success = false;
    response.error = 'Hubo un error al actualizar el barrio.';

    return response;
  }
};

/* --- ACCIONES DE LOS LUGARES DEL CEMENTERIO --- */
export const getCementeryPlaces = async (): Promise<
  Envelope<cementery_place[]>
> => {
  const response: Envelope<cementery_place[]> = {
    success: true,
    data: null,
    pagination: null,
  };
  try {
    const cementeryPlaces = await dbSupabase.city_section.findMany();

    response.data = cementeryPlaces;

    return response;
  } catch (error) {
    console.error({ error });

    response.success = false;
    response.error = 'Hubo un error al obtener los lugares del cementerio.';

    return response;
  }
};

export const addCementeryPlace = async (input: {
  name: string;
}): Promise<Envelope<string>> => {
  const response: Envelope<string> = {
    success: true,
    data: null,
    pagination: null,
  };
  try {
    const created = await dbSupabase.cementery_place.create({
      data: {
        name: input.name,
      },
    });

    if (!created) {
      response.success = false;
      response.error = 'Hubo un error al crear el lugar del cementerio.';
      return response;
    }

    response.data = 'Lugar del cementerio creado con éxito.';

    return response;
  } catch (error) {
    console.error({ error });

    response.success = false;
    response.error = 'Hubo un error al crear el lugar del cementerio.';

    return response;
  }
};

export const updateCementeryPlace = async (input: {
  id: number;
  name: string;
}): Promise<Envelope<string>> => {
  const response: Envelope<string> = {
    success: true,
    data: null,
    pagination: null,
  };
  try {
    const updated = await dbSupabase.cementery_place.update({
      where: {
        id: input.id,
      },
      data: {
        name: input.name,
      },
    });

    if (!updated) {
      response.success = false;
      response.error = 'Hubo un error al actualizar el lugar del cementerio.';
      return response;
    }

    response.data = 'Lugar del cementerio actualizado con éxito.';

    return response;
  } catch (error) {
    console.error({ error });

    response.success = false;
    response.error = 'Hubo un error al actualizar el lugar del cementerio.';

    return response;
  }
};

/* --- ACCIONES DE LOS TIPOS DE SEPULTURAS --- */
export const getBurialTypes = async (): Promise<Envelope<burial_type[]>> => {
  const response: Envelope<burial_type[]> = {
    success: true,
    data: null,
    pagination: null,
  };
  try {
    const burialTypes = await dbSupabase.burial_type.findMany();

    response.data = burialTypes;

    return response;
  } catch (error) {
    console.error({ error });

    response.success = false;
    response.error = 'Hubo un error al obtener los tipos de sepulturas.';

    return response;
  }
};

export const addBurialType = async (input: {
  type: string;
  price: number;
}): Promise<Envelope<string>> => {
  const response: Envelope<string> = {
    success: true,
    data: null,
    pagination: null,
  };
  try {
    const created = await dbSupabase.burial_type.create({
      data: {
        type: input.type,
        price: input.price,
      },
    });

    if (!created) {
      response.success = false;
      response.error = 'Hubo un error al crear el tipo de sepultura.';
      return response;
    }

    response.data = 'Tipo de sepultura creado con éxito.';

    return response;
  } catch (error) {
    console.error({ error });

    response.success = false;
    response.error = 'Hubo un error al crear el tipo de sepultura.';

    return response;
  }
};

export const updateBurialType = async (input: {
  id: number;
  type?: string;
  price?: number;
}): Promise<Envelope<string>> => {
  const response: Envelope<string> = {
    success: true,
    data: null,
    pagination: null,
  };
  try {
    const inputData: Prisma.burial_typeUpdateInput = {};

    if (input.type) {
      inputData.type = input.type;
    }

    if (input.price) {
      inputData.price = input.price;
    }

    const updated = await dbSupabase.burial_type.update({
      where: {
        id: input.id,
      },
      data: inputData,
    });

    if (!updated) {
      response.success = false;
      response.error = 'Hubo un error al actualizar el tipo de sepultura.';
      return response;
    }

    response.data = 'Tipo de sepultura actualizado con éxito.';

    return response;
  } catch (error) {
    console.error({ error });

    response.success = false;
    response.error = 'Hubo un error al actualizar el tipo de sepultura.';

    return response;
  }
};

/* --- ACCIONES DE LAS SOLICITUDES DE REGISTRO --- */
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
