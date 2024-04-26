'use client';
import { UserOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import Link from 'next/link';

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

      <Button
        icon={<UserOutlined />}
        shape='circle'
        type='primary'
        size='middle'
        style={{ margin: '1em' }}
      />
      <Button
        icon={<UserOutlined />}
        shape='circle'
        type='primary'
        size='large'
        style={{ margin: '1em' }}
      />

      <Button
        icon={<UserOutlined />}
        type='primary'
        size='middle'
        style={{ margin: '1em' }}
      >
        middle
      </Button>
      <Button
        icon={<UserOutlined />}
        type='primary'
        size='large'
        style={{ margin: '1em' }}
      >
        large
      </Button>

      <Button
        icon={<UserOutlined />}
        type='primary'
        size='large'
        disabled
        style={{ margin: '1em' }}
      >
        Disabled
      </Button>
    </>
  );
}
