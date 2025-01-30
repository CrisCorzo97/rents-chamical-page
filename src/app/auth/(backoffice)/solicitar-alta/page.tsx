import { Button } from '@/components/ui';
import Link from 'next/link';
import { PreRegisterForm } from '../components/pre-register-form';
import { ChevronLeft } from 'lucide-react';
import { getRoles } from '../auth-bo.actions';

export default async function RegistrationRequestPage() {
  const { data } = await getRoles();

  return (
    <section className='relative flex flex-col items-center justify-center h-screen'>
      <Link href='/' replace prefetch>
        <Button
          variant='outline'
          className='absolute top-2 left-1 flex items-center gap-2 md:top-4 md:left-4'
        >
          <ChevronLeft />
          Volver al inicio
        </Button>
      </Link>
      <PreRegisterForm roles={data ?? []} />
    </section>
  );
}
