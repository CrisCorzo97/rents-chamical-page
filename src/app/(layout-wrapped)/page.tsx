'use client';
import { Button } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  return (
    <>
      <Link href='/auth/ingresar'>
        <Button type='primary' style={{ marginTop: '1em' }}>
          Iniciar sesión
        </Button>
      </Link>

      <Link href='/municipio'>
        <Button type='primary' style={{ margin: '1em' }}>
          Municipio
        </Button>
      </Link>
    </>
  );
}
