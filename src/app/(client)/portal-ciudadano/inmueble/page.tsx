'use client';
import { Button, Input } from '@/components/ui';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import ReCAPTCHA from 'react-google-recaptcha';

const G_RECAPTCHA_SITE_KEY = process.env.G_RECAPTCHA_SITE_KEY!;

export default function PropertyPage() {
  const handleRecaptcha = (token: string | null) => {
    console.log(token);
  };

  return (
    <>
      <Breadcrumb className='max-w-6xl mx-auto h-12'>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href='/' prefetch>
                Inicio
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href='/portal-ciudadano' prefetch>
                Portal del ciudadano
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Inmueble</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <section className='max-w-6xl mx-auto mb-8'>
        <h1 className='text-4xl font-bold mb-4'>Inmueble</h1>
        <p className='text-lg max-w-2xl text-gray-500'>
          Para consultar información sobre el estado del impuesto de tus
          inmuebles, por favor introduce tu matrícula catastral.
        </p>
      </section>

      <section className='max-w-6xl mx-auto flex gap-4 flex-wrap'>
        <Card className='max-w-2xl'>
          <CardHeader>
            <CardTitle>Buscador</CardTitle>
            <CardDescription>
              Por favor, introduce tu matrícula catastral. Si no cuentas con
              ella, deberás acercarte por la oficina de rentas de la
              municipalidad.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <Input placeholder='0123-4567-7890' />
              <ReCAPTCHA
                sitekey={
                  G_RECAPTCHA_SITE_KEY ??
                  '6LfDNzIqAAAAAB0hIO4txu1Lb_5fH_IHLF39bG4-'
                }
                onChange={handleRecaptcha}
              />
            </form>
          </CardContent>
          <CardFooter className='border-t px-6 py-4'>
            <Button>Save</Button>
          </CardFooter>
        </Card>
      </section>
    </>
  );
}
function useRecaptcha(): {
  capchaToken: any;
  recaptchaRef: any;
  handleRecaptcha: any;
} {
  throw new Error('Function not implemented.');
}
