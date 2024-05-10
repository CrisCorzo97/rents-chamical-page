'use client';
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
import { ArrowLeftOutlined, CheckCircleFilled } from '@ant-design/icons';
import theme from '@/theme/themeConfig';
import axios, { AxiosError } from 'axios';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { SuccessModal } from '@/app/ui';
import Link from 'next/link';
import { Rule } from 'antd/es/form';

type FieldType = {
  newPassword: string;
  confirmPassword: string;
};

export default function ResetPasswordPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [isPending, startTransition] = useTransition();
  const [isSuccessfulRequest, setIsSuccessfulRequest] =
    useState<boolean>(false);

  const { back } = useRouter();

  const handleSubmit = async (values: FieldType) => {
    const { newPassword } = values;
    try {
      startTransition(async () => {
        const formData = new FormData();

        formData.append('new_password', newPassword);

        const { data } = await axios.post<{
          success: boolean;
          message?: string;
        }>('/api/auth/reset-password', formData);

        if (!data.success) {
          messageApi.error(data.message, 5);
        } else {
          setIsSuccessfulRequest(true);
        }
      });
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        messageApi.error(error.message, 5);
      } else {
        messageApi.error(
          'Ocurrió un error al intentar recuperar tu contraseña. Por favor, intenta nuevamente.',
          5
        );
      }
    }
  };

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
              Elige una nueva contraseña
            </Typography.Paragraph>

            <Form layout='vertical' size='large' onFinish={handleSubmit}>
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
        open={isSuccessfulRequest}
        title='¡Listo!'
        subtitle='Tu contraseña ha sido actualizada correctamente.'
        icon={<CheckCircleFilled style={{ color: '#5ba02e' }} />}
        extra={[
          [
            <Link href='/auth/ingresar' replace key='go-login' prefetch>
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
