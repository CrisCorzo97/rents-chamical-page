'use client';
import { Button } from '@/components/ui';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <section className='flex gap-1 max-w-6xl mx-auto items-center'>
        <Link href='/private/dashboard'>
          <Button>Ir al Dashboard</Button>
        </Link>
        <Link href='/pruebas-table'>
          <Button>Pruebas Tabla</Button>
        </Link>
      </section>

      <div className='max-w-6xl mx-auto '>
        <h1 className='text-4xl font-bold'>¡Bienvenido a tu aplicación!</h1>
        <p className='text-lg'>
          Este es un proyecto de ejemplo para mostrar cómo se puede estructurar
          una aplicación con Next.js y Tailwind CSS.
        </p>
      </div>
    </>
  );
}
