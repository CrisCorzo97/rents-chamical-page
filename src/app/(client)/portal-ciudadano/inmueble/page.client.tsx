'use client';

import { Button, Input } from '@/components/ui';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const G_RECAPTCHA_SITE_KEY = process.env.G_RECAPTCHA_SITE_KEY!;

export const PropertyQueryForm = () => {
  return (
    <section className='max-w-6xl mx-auto flex gap-4 flex-wrap'>
      <Card className='max-w-2xl'>
        <CardHeader>
          <CardTitle>Buscador</CardTitle>
          <CardDescription>
            Por favor, introduce tu matrícula catastral. Si no cuentas con ella,
            deberás acercarte por la oficina de rentas de la municipalidad.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <Input placeholder='0123-4567-7890' />
          </form>
        </CardContent>
        <CardFooter className='border-t px-6 py-4'>
          <Button>Save</Button>
        </CardFooter>
      </Card>
    </section>
  );
};
