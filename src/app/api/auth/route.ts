// import { NextRequest } from 'next/server';
import { NextRequest } from 'next/server';
import { login, signup } from './actions';
import { NextApiResponse } from 'next';

const derivador: Record<string, (val: FormData) => void> = {
  '/auth/ingresar': login,
  '/auth/solicitar-alta': signup,
};

export async function POST(request: NextRequest, response: NextApiResponse) {
  const urlReferer = request.headers.get('referer');
  const urlOrigin = request.nextUrl.origin;

  const urlPathname = urlReferer?.split(urlOrigin)[1];

  if (!urlPathname) {
    return response.redirect('/error');
  }

  const validUrls = Object.keys(derivador);
  if (!validUrls.includes(request.nextUrl.pathname)) {
    return response.redirect('/error');
  }

  const formData = await request.formData();
  const action = derivador[request.nextUrl.pathname];

  switch (request.nextUrl.pathname) {
    case '/auth/ingresar':
      return action(formData);
    case '/auth/solicitar-alta':
      return action(formData);
    default:
      return response.redirect('/error');
  }
}
