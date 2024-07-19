'use client';
import { Button } from '@/components/ui';
import Link from 'next/link';

export default function Home() {
  return (
    <main className=' w-full px-2'>
      <section className='flex gap-1 max-w-6xl mx-auto py-2 items-center'>
        <Link href='/private/dashboard'>
          <Button>Ir al Dashboard</Button>
        </Link>
        <Link href='/pruebas-ui'>
          <Button>Pruebas UI</Button>
        </Link>
        <Link href='/pruebas-filter'>
          <Button>Pruebas Filter</Button>
        </Link>
        <Link href='/pruebas-table'>
          <Button>Pruebas Tabla</Button>
        </Link>
      </section>
    </main>
  );
}
