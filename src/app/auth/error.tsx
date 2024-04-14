'use client';

import { Button, Result } from 'antd';

export default function ErrorPage() {
  return (
    <Result
      status='403'
      title='403'
      subTitle='Lo siento, no tienes permiso para acceder a esta página.'
      extra={<Button type='primary'>Volver al inicio</Button>}
    />
  );
}
