import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';

export async function POST(request: NextRequest) {
  try {
    const form_data = await request.formData();

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const first_name = form_data.get('first_name');
    const last_name = form_data.get('last_name');
    const email = form_data.get('email');
    const cuil = form_data.get('cuil');
    const role = form_data.get('role');

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

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: 'Email sent',
    });
  } catch (error) {
    console.error({ error });
    return NextResponse.json({
      success: false,
      message: 'Error not handled',
    });
  }
}
