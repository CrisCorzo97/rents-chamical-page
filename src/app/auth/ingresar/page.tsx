'use client';
import { Alert, Button, Card, Form, Input, Space, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import theme from '@/theme/themeConfig';
import { login } from '@/lib/auth/actions';
import { useForm } from 'antd/es/form/Form';

type FieldType = {
  email?: string;
  password?: string;
};

export default function LoginPage() {
  const { replace } = useRouter();

  const [form] = useForm();

  return (
    <Card
      style={{
        maxWidth: 400,
        margin: '0 auto',
        boxShadow: '0 0 16px rgba(0, 0, 0, 0.05)',
        padding: '1em',
      }}
    >
      <Space
        direction='vertical'
        style={{ marginBottom: '1em', width: '100%' }}
      >
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
          style={{ fontSize: '14px', lineHeight: '1.25', marginBottom: '1em' }}
        />

        <Form layout='vertical' size='large' form={form} id='login-form'>
          <Form.Item<FieldType>
            label='Email'
            name='email'
            rules={[{ required: true, message: 'Por favor ingresa un email!' }]}
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
              { required: true, message: 'Por favor ingresa tu contraseña!' },
            ]}
            htmlFor='password'
            style={{ marginBottom: '0.75em' }}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#b3b3b3' }} />}
              placeholder='********'
            />
          </Form.Item>

          <Typography.Paragraph
            onClick={() => alert('Me olvidé la contra!!')}
            style={{
              color: theme.token?.colorPrimary,
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            ¿Olvidaste tu contraseña?
          </Typography.Paragraph>

          <Button
            form='login-form'
            style={{ marginTop: '1em', marginBottom: '0.75em' }}
            type='primary'
            htmlType='submit'
            block
            formAction={login}
          >
            Iniciar sesión
          </Button>

          <Typography.Paragraph
            style={{
              fontSize: '14px',
            }}
          >
            ¿No tienes cuenta?{' '}
            <Typography.Text
              onClick={() => replace('/auth/signup')}
              style={{
                fontSize: '14px',
                color: theme.token?.colorPrimary,
                cursor: 'pointer',
              }}
            >
              Solicitar alta
            </Typography.Text>
          </Typography.Paragraph>
        </Form>
      </Space>
    </Card>
  );
}
