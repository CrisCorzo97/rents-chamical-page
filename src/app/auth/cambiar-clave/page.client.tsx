'use client';
import { SuccessModal } from '@/app/ui';
import theme from '@/theme/themeConfig';
import { ArrowLeftOutlined, CheckCircleFilled } from '@ant-design/icons';
import {
  Button,
  Card,
  Flex,
  Form,
  Input,
  Space,
  Typography,
  message,
} from 'antd';
import { Rule } from 'antd/es/form';
import axios, { AxiosError } from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

type FieldType = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export function ChangePasswordComponent({
  prevPassword,
}: {
  prevPassword?: string;
}) {
  const [messageApi, contextHolder] = message.useMessage();
  const [isPending, startTransition] = useTransition();
  const [isSuccessful, setIsSuccessful] = useState<boolean>(false);

  const [form] = Form.useForm();
  const { back } = useRouter();

  const handleSubmit = async (values: FieldType) => {
    const { oldPassword, newPassword } = values;
    try {
      startTransition(async () => {
        const formData = new FormData();
        formData.append('old_password', oldPassword);
        formData.append('new_password', newPassword);

        const { data } = await axios.post<{
          success: boolean;
          message?: string;
        }>('/api/auth/change-password', formData);

        if (!data.success) {
          messageApi.error(data.message, 5);
        } else {
          setIsSuccessful(true);
        }
      });
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        messageApi.error(error.message, 5);
      } else {
        messageApi.error(
          'Ha ocurrido un error. Por favor, intenta de nuevo.',
          5
        );
      }
    }
  };

  useEffect(() => {
    if (prevPassword) form.setFieldValue('oldPassword', prevPassword);
  }, [prevPassword, form]);

  const addPassValidations = (
    type: 'newPassword' | 'confirmPassword'
  ): Rule[] => {
    const inputMessage =
      type === 'newPassword'
        ? 'tu nueva contraseña'
        : 'la confirmación de tu contraseña';
    return [
      {
        required: true,
        message: `Por favor ingresa ${inputMessage}`,
      },
      {
        type: 'string',
        min: 8,
        message: `La contraseña debe tener al menos 8 caracteres`,
      },
      {
        type: 'string',
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        message: `La contraseña debe tener al menos una letra mayúscula, una minúscula y un número`,
      },
      {
        type: 'string',
        pattern: /^\S*$/,
        message: `La contraseña no puede tener espacios en blanco`,
      },
    ];
  };

  return (
    <Space direction='vertical' style={{ width: '100%', minHeight: '100vh' }}>
      {contextHolder}
      {!prevPassword ? (
        <Button
          type='default'
          icon={<ArrowLeftOutlined />}
          size='large'
          style={{ justifySelf: 'flex-start', margin: '1em' }}
          onClick={back}
        >
          Volver
        </Button>
      ) : (
        <></>
      )}
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
              Elige tu nueva contraseña
            </Typography.Paragraph>

            <Form
              layout='vertical'
              size='large'
              onFinish={handleSubmit}
              form={form}
            >
              <Form.Item<FieldType>
                label='Contraseña actual'
                name='oldPassword'
                htmlFor='oldPassword'
                required
                style={{ marginBottom: '0.5em' }}
              >
                <Input.Password
                  disabled={!!prevPassword}
                  visibilityToggle={!prevPassword}
                  placeholder='********'
                />
              </Form.Item>
              <Form.Item<FieldType>
                label='Nueva contraseña'
                name='newPassword'
                validateDebounce={1000}
                rules={addPassValidations('newPassword')}
                htmlFor='newPassword'
                style={{ marginBottom: '0.5em' }}
              >
                <Input.Password placeholder='********' />
              </Form.Item>
              <Form.Item<FieldType>
                label='Confirmar contraseña'
                name='confirmPassword'
                dependencies={['newPassword']}
                validateDebounce={1000}
                rules={[
                  ...addPassValidations('confirmPassword'),
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error('Las contraseñas no coinciden')
                      );
                    },
                  }),
                ]}
                htmlFor='confirmPassword'
              >
                <Input.Password placeholder='********' />
              </Form.Item>

              <Button
                style={{ marginTop: '1em', marginBottom: '0.75em' }}
                type='primary'
                htmlType='submit'
                block
                loading={isPending}
              >
                Cambiar contraseña
              </Button>
            </Form>
          </Space>
        </Card>
      </Flex>
      <SuccessModal
        open={isSuccessful}
        title='¡Solicitud enviada con éxito!'
        subtitle='En las próximas 48 horas hábiles, recibirás un correo electrónico informando el estado de la misma.'
        icon={<CheckCircleFilled style={{ color: '#5ba02e' }} />}
        extra={[
          [
            <Link href='/' replace key='go-home'>
              <Button size='large'>Ir al inicio</Button>
            </Link>,
            <Link href='/auth/ingresar' replace key='go-login'>
              <Button type='primary' size='large'>
                Iniciar sesión
              </Button>
            </Link>,
          ],
        ]}
      />
    </Space>
  );
}
