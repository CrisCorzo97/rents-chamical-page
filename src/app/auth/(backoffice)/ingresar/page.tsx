'use client';
import { LoginForm } from '@/app/auth/(backoffice)/components/login-form';
import { Button } from '@/components/ui';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <section className='relative flex flex-col items-center justify-center h-screen'>
      <Link href='/' replace prefetch>
        <Button
          variant='outline'
          className='absolute top-4 left-4 flex items-center gap-2'
        >
          <ArrowLeftOutlined />
          Volver al inicio
        </Button>
      </Link>
      <LoginForm />
    </section>
  );
}
