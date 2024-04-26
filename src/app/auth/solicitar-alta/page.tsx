'use client';
import {
  Alert,
  Button,
  Card,
  Flex,
  Form,
  Input,
  Select,
  Space,
  Typography,
  message,
} from 'antd';
import { useRouter } from 'next/navigation';
import { Rule } from 'antd/es/form';
import { formatCuilInput } from '@/utils/formatters';
import theme from '@/theme/themeConfig';
import { cuilValidator } from '@/utils/validators';
import Link from 'next/link';
import axios from 'axios';
import { ArrowLeftOutlined } from '@ant-design/icons';

const roleOptions = [
  { value: 'admin', label: 'Administrador' },
  { value: 'press', label: 'Prensa' },
  { value: 'rent', label: 'Renta' },
];

export type FieldType = {
  first_name: string;
  last_name: string;
  email: string;
  cuil: string;
  role: 'adimin' | 'press' | 'rent';
};

export default function SignupPage() {
  const { replace } = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  const handleSubmit = async (values: FieldType) => {
    try {
      const formData = new FormData();

      for (const key in values) {
        if (values.hasOwnProperty(key)) {
          formData.append(key, values[key as keyof FieldType]);
        }
      }

      const { data } = await axios.post<{ success: boolean; message: string }>(
        '/api/auth/registration-request',
        formData
      );

      console.log({ data });

      if (!data.success) {
        return messageApi.error(data.message, 4);
      }

      return messageApi.success('Solicitud enviada con éxito.', 4);
    } catch (error) {
      console.log({ error });
      return messageApi.error(
        'Error al enviar la solicitud. Por favor intente nuevamente.',
        4
      );
    }
  };

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
    <Space direction='vertical' style={{ width: '100%', minHeight: '100vh' }}>
      {contextHolder}
      <Link href='/' replace>
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
              style={{
                fontSize: '14px',
                lineHeight: '1.25',
                marginBottom: '1em',
              }}
            />

            <Form layout='vertical' onFinish={handleSubmit}>
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
                htmlFor='last_name'
              >
                <Input placeholder='Cabrera' />
              </Form.Item>
              <Form.Item<FieldType>
                label='Email'
                name='email'
                rules={[
                  { required: true, message: 'Por favor ingresa un email.' },
                ]}
                htmlFor='email'
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
                <Link href='/auth/ingresar' replace>
                  <Typography.Text
                    style={{
                      fontSize: '14px',
                      color: theme.token?.colorPrimary,
                      cursor: 'pointer',
                    }}
                  >
                    Ingresar
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
