import dbSupabase from '@/lib/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';

export async function POST(request: NextRequest) {
  try {
    const form_data = await request.formData();

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const first_name = form_data.get('first_name')?.toString();
    const last_name = form_data.get('last_name')?.toString();
    const email = form_data.get('email')?.toString();
    const cuil = form_data.get('cuil')?.toString();
    const role = form_data.get('role')?.toString();

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
      return NextResponse.json({
        success: false,
        message:
          'Hubo un error al enviar la solicitud. Por favor, intente nuevamente.',
      });
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
      return NextResponse.json({
        success: false,
        message:
          'Hubo un error al enviar la solicitud. Por favor, intente nuevamente.',
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Email sent',
    });
  } catch (error) {
    console.error({ error });
    return NextResponse.json({
      success: false,
      message: 'Hubo un error de servidor. Por favor, intente nuevamente.',
    });
  }
}
