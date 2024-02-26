'use client';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { push } = useRouter();

  return (
    <main>
      <Button type='primary' onClick={() => push('/login')}>
        Iniciar sesión
      </Button>
    </main>
  );
}
