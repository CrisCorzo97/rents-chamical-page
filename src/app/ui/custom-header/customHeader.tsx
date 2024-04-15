'use client';
import { Avatar, Button, Flex, Layout } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './styles.module.scss';
import { useMemo } from 'react';

type MenuItem = {
  label: string;
  key: string;
};

const items: MenuItem[] = [
  {
    label: 'Inicio',
    key: '/',
  },
  {
    label: 'Municipio',
    key: '/municipio',
  },
  {
    label: 'Recaudación',
    key: '/recaudacion-municipal',
  },
  {
    label: 'Portal de comunicación',
    key: '/portal-de-comunicacion',
  },
  {
    label: 'Ingresar',
    key: '/auth/ingresar',
  },
];

const { Header } = Layout;

export const CustomHeader = () => {
  const pathname = usePathname();

  const currentPath = useMemo(() => {
    if (pathname === '/') return '/';

    const filtered = items.filter((item) => item.key !== '/');

    const pathFounded = filtered.find((item) =>
      pathname.includes(item.key)
    )?.key;

    return pathFounded ?? '/';
  }, [pathname]);

  return (
    <Header
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f02389',
        margin: 0,
        padding: 0,
      }}
    >
      <Flex
        justify='space-between'
        align='center'
        style={{ maxWidth: '1024px', width: '100%' }}
      >
        <Avatar shape='square' size='large' />

        <ul className={styles.nav}>
          {items.map((item) => (
            <li key={item.key} className={styles.item}>
              <Link href={item.key} prefetch>
                <Button
                  type='primary'
                  size='large'
                  className={
                    currentPath === item.key ? styles.itemSelected : undefined
                  }
                >
                  {item.label}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </Flex>
    </Header>
  );
};
