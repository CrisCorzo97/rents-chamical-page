'use client';
import { LoginForm } from '@/app/auth/(backoffice)/components/login-form';

export default function LoginPage() {
  return (
    <section className='flex flex-col items-center justify-center h-screen'>
      <LoginForm />
    </section>
  );
}
