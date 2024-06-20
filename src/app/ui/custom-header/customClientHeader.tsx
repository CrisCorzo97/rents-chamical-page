'use client';
import { Avatar, Button, Dropdown, Flex, Layout, MenuProps } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './styles.module.scss';
import React, { useMemo } from 'react';
import {
  ItemType,
  MenuItemType,
  SubMenuType,
} from 'antd/es/menu/hooks/useItems';

const { Header } = Layout;

export const CustomClientHeader = ({ isLogged }: { isLogged: boolean }) => {
  const pathname = usePathname();

  const items: MenuProps['items'] = useMemo(() => {
    const lastButton: ItemType = isLogged
      ? {
          label: 'Panel de Administración',
          key: '/private/dashboard',
          children: [
            {
              label: (
                <Link href='/auth/logout' prefetch>
                  Cerrar sesión
                </Link>
              ),
              key: '/auth/logout',
            },
          ],
        }
      : { label: 'Ingresar', key: '/auth/ingresar' };

    return [
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
      lastButton,
    ];
  }, [isLogged]);

  const currentPath = useMemo(() => {
    if (pathname === '/') return '/';

    const filtered = items.filter((item) => item?.key !== '/');

    const pathFounded = filtered.find(
      (item) => !!item && !!item.key && pathname.includes(item.key as string)
    )?.key;

    return pathFounded ?? '/';
  }, [pathname, items]);

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
            <React.Fragment key={item?.key}>
              {(item as SubMenuType<MenuItemType>)?.children &&
              (item as SubMenuType<MenuItemType>).children.length > 0 ? (
                <li key={item?.key} className={styles.item}>
                  <Dropdown
                    arrow
                    menu={{
                      items: (item as SubMenuType<MenuItemType>)?.children,
                    }}
                    placement='topRight'
                  >
                    <Link href={(item?.key as string) ?? '/'} prefetch>
                      <Button
                        type='primary'
                        size='large'
                        className={
                          currentPath === item?.key
                            ? styles.itemSelected
                            : undefined
                        }
                      >
                        {(item as SubMenuType<MenuItemType>)?.label}
                      </Button>
                    </Link>
                  </Dropdown>
                </li>
              ) : (
                <li key={item?.key} className={styles.item}>
                  <Link href={(item?.key as string) ?? '/'} prefetch>
                    <Button
                      type='primary'
                      size='large'
                      className={
                        currentPath === item?.key
                          ? styles.itemSelected
                          : undefined
                      }
                    >
                      {(item as SubMenuType<MenuItemType>)?.label}
                    </Button>
                  </Link>
                </li>
              )}
            </React.Fragment>
          ))}
        </ul>
      </Flex>
    </Header>
  );
};
