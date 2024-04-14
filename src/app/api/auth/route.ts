// import { NextRequest } from 'next/server';
import { NextRequest } from 'next/server';
import { login, signup } from './actions';
import { NextApiResponse } from 'next';

const derivador: Record<string, (val: FormData) => void> = {
  '/api/auth/login': login,
  '/api/auth/register': signup,
};

export async function POST(request: NextRequest, response: NextApiResponse) {
  const validUrls = Object.keys(derivador);
  if (!validUrls.includes(request.nextUrl.pathname)) {
    return response.redirect('/error');
  }

  const formData = await request.formData();
  const action = derivador[request.nextUrl.pathname];

  switch (request.nextUrl.pathname) {
    case '/api/auth/login':
      return action(formData);
    case '/api/auth/register':
      return action(formData);
    default:
      return response.redirect('/error');
  }
}
