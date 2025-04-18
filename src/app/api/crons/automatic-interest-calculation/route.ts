'use server';

import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  try {
    const response = await axios.post(
      'https://apkomtlxqddpzutagjvn.supabase.co/functions/v1/Update-Invoice-Interests',
      undefined,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY}`,
        },
      }
    );

    return NextResponse.json({
      status: 200,
      body: response.data,
    });
  } catch (error: any) {
    console.error(error.response.data);
    throw new Error('Hubo un error al actualizar los intereses');
  }
}
