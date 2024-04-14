import { Avatar, Flex, Layout, Menu, MenuProps } from 'antd';
import { useRouter } from 'next/navigation';

const items: MenuProps['items'] = [
  {
    label: 'Inicio',
    key: '/',
  },
  {
    label: 'Municipio',
    key: '/municipio',
  },
  {
    label: 'Rentas',
    key: '/rentas',
  },
  {
    label: 'Portal de comunicación',
    key: '/portal-de-comunicacion',
  },
  {
    label: 'Ingresar',
    key: '/ingresar',
  },
];

const { Header } = Layout;

export const CustomHeader = () => {
  const router = useRouter();

  const handleNavigation: MenuProps['onSelect'] = ({ key }) => {
    router.push(`/${key}`);
  };

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
        <div
          style={{
            minWidth: '538px',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
          }}
        >
          <Menu
            mode='horizontal'
            items={items}
            style={{ width: '100%' }}
            onSelect={handleNavigation}
          />
        </div>
      </Flex>
    </Header>
  );
};
