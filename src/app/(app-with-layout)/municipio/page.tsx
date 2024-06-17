import { Button } from 'antd';
import Link from 'next/link';

export default function Municipio() {
  return (
    <Link href='/'>
      <Button type='primary' style={{ margin: '1em' }}>
        Inicio
      </Button>
    </Link>
  );
}
