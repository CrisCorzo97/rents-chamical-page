'use client';
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  Select,
  Space,
  Typography,
} from 'antd';
import { signup } from '@/lib/auth/actions';
import { useRouter } from 'next/navigation';
import { Rule } from 'antd/es/form';
import { formatCuilInput } from '@/utils/formatters';
import theme from '@/theme/themeConfig';
import { cuilValidator } from '@/utils/validators';

const roleOptions = [
  { value: 'admin', label: 'Administrador' },
  { value: 'press', label: 'Prensa' },
  { value: 'rent', label: 'Renta' },
];

type FieldType = {
  first_name: string;
  last_name: string;
  email: string;
  cuil: string;
  role: 'adimin' | 'press' | 'rent';
};

export default function SignupPage() {
  const { replace } = useRouter();

  const addNameValidations = (type: 'first_name' | 'last_name'): Rule[] => {
    const inputMessage = type === 'first_name' ? 'nombre' : 'apellido';
    return [
      {
        type: 'string',
        min: 3,
        message: `El ${inputMessage} debe tener al menos 3 caracteres`,
      },
      {
        pattern: /^[a-zA-ZñÑáéíóúÁÉÍÓÚ]+$/,
        message: `El ${inputMessage} solo puede contener letras`,
      },
    ];
  };

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
          Solicitar acceso a una cuenta
        </Typography.Paragraph>

        <Alert
          message='El acceso a una cuenta solo está permitido para personal autorizado
          por la Municipalidad.'
          type='info'
          showIcon
          style={{ fontSize: '14px', lineHeight: '1.25', marginBottom: '1em' }}
        />

        <Form layout='vertical'>
          <Form.Item<FieldType>
            label='Nombre'
            name='first_name'
            rules={[
              {
                required: true,
                message: 'Por favor ingresa un nombre.',
              },
              ...addNameValidations('first_name'),
            ]}
            htmlFor='first_name'
          >
            <Input placeholder='Carlos' />
          </Form.Item>
          <Form.Item<FieldType>
            label='Apellido'
            name='last_name'
            rules={[
              { required: true, message: 'Por favor ingresa un apellido.' },
              ...addNameValidations('last_name'),
            ]}
            htmlFor='email'
          >
            <Input placeholder='Cabrera' />
          </Form.Item>
          <Form.Item<FieldType>
            label='Email'
            name='email'
            rules={[{ required: true, message: 'Por favor ingresa un email.' }]}
            htmlFor='email'
            normalize={(value) => formatCuilInput(value)}
          >
            <Input type='email' placeholder='tuemail@aqui.com' />
          </Form.Item>

          <Form.Item<FieldType>
            label='CUIL'
            name='cuil'
            rules={[
              { required: true, message: 'Por favor ingresa un CUIL.' },
              {
                validator: cuilValidator,
                message: 'El CUIL ingresado no es válido.',
              },
            ]}
            htmlFor='cuil'
            trigger='onChange'
            normalize={formatCuilInput}
          >
            <Input placeholder='20-24757105-2' maxLength={13} />
          </Form.Item>
          <Form.Item<FieldType>
            label='Rol'
            name='role'
            rules={[
              { required: true, message: 'Por favor selecciona un rol.' },
            ]}
            htmlFor='role'
          >
            <Select options={roleOptions} placeholder='Renta' />
          </Form.Item>

          <Button
            style={{ marginTop: '1em', marginBottom: '0.75em' }}
            type='primary'
            size='large'
            htmlType='submit'
            formAction={signup}
            block
          >
            Enviar
          </Button>

          <Typography.Paragraph
            style={{
              fontSize: '14px',
            }}
          >
            Ya tengo una cuenta.{' '}
            <Typography.Text
              onClick={() => replace('/login')}
              style={{
                fontSize: '14px',
                color: theme.token?.colorPrimary,
                cursor: 'pointer',
              }}
            >
              Ingresar
            </Typography.Text>
          </Typography.Paragraph>
        </Form>
      </Space>
    </Card>
  );
}
