'use client';
import theme from '@/theme/themeConfig';
import {
  ArrowLeftOutlined,
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  Flex,
  Form,
  Input,
  Space,
  Typography,
  message,
} from 'antd';
import axios, { AxiosError } from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

type FieldType = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [isPending, startTransition] = useTransition();

  const { replace } = useRouter();

  const handleSubmit = async (values: FieldType) => {
    const { email, password } = values;
    try {
      startTransition(async () => {
        const formData = new FormData();

        formData.append('email', email);
        formData.append('password', password);

        const { data } = await axios.post<{
          success: boolean;
          message?: string;
        }>('/api/auth/signin', formData);

        if (!data.success) {
          messageApi.error(data.message, 5);
        } else {
          replace('/private/admin/dashboard');
        }
      });
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        messageApi.error(error.message, 5);
      } else {
        messageApi.error(
          'Error al iniciar sesión. Por favor intente nuevamente.',
          5
        );
      }
    }
  };

  return (
    <Space direction='vertical' style={{ width: '100%', minHeight: '100vh' }}>
      {contextHolder}
      <Link href='/' replace prefetch>
        <Button
          type='default'
          icon={<ArrowLeftOutlined />}
          size='large'
          style={{ justifySelf: 'flex-start', margin: '1em' }}
        >
          Volver al inicio
        </Button>
      </Link>
      <Flex style={{ minHeight: 'calc(100vh - 84px)' }} align='center'>
        <Card
          style={{
            maxWidth: 400,
            margin: '0 auto',
            boxShadow: '0 0 16px rgba(0, 0, 0, 0.05)',
            padding: '1em',
          }}
        >
          <Space direction='vertical' style={{ width: '100%' }}>
            <Typography.Paragraph
              style={{
                fontWeight: '600',
                fontSize: '22px',
                textAlign: 'center',
                color: theme.token?.colorPrimary,
              }}
            >
              Ingresar a tu cuenta
            </Typography.Paragraph>

            <Alert
              message='El acceso es solo para usuarios autorizados.'
              type='info'
              showIcon
              style={{
                fontSize: '14px',
                lineHeight: '1.25',
                marginBottom: '1em',
              }}
            />

            <Form layout='vertical' size='large' onFinish={handleSubmit}>
              <Form.Item<FieldType>
                label='Email'
                name='email'
                rules={[
                  { required: true, message: 'Por favor ingresa un email!' },
                ]}
                htmlFor='email'
              >
                <Input
                  prefix={<UserOutlined style={{ color: '#b3b3b3' }} />}
                  type='email'
                  placeholder='tuemail@aqui.com'
                />
              </Form.Item>
              <Form.Item<FieldType>
                label='Contraseña'
                name='password'
                rules={[
                  {
                    required: true,
                    message: 'Por favor ingresa tu contraseña!',
                  },
                ]}
                htmlFor='password'
                style={{ marginBottom: '0.75em' }}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#b3b3b3' }} />}
                  placeholder='********'
                />
              </Form.Item>

              <Link href='/auth/solicitar-recupero-clave' prefetch>
                <Typography.Paragraph
                  style={{
                    color: theme.token?.colorPrimary,
                    fontSize: '14px',
                    cursor: 'pointer',
                  }}
                >
                  ¿Olvidaste tu contraseña?
                </Typography.Paragraph>
              </Link>

              <Button
                style={{ marginTop: '1em', marginBottom: '0.75em' }}
                type='primary'
                htmlType='submit'
                block
                loading={isPending}
              >
                Iniciar sesión
              </Button>

              <Typography.Paragraph
                style={{
                  fontSize: '14px',
                }}
              >
                ¿No tienes cuenta?{' '}
                <Link href='/auth/solicitar-alta' replace prefetch>
                  <Typography.Text
                    style={{
                      fontSize: '14px',
                      color: theme.token?.colorPrimary,
                      cursor: 'pointer',
                    }}
                  >
                    Solicitar alta
                  </Typography.Text>
                </Link>
              </Typography.Paragraph>
            </Form>
          </Space>
        </Card>
      </Flex>
    </Space>
  );
}
