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
import { ArrowLeftOutlined, UserOutlined } from '@ant-design/icons';
import theme from '@/theme/themeConfig';
import axios, { AxiosError } from 'axios';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { SuccessModal } from '@/app/ui';
import Link from 'next/link';
import { MailSentIllustration } from '@/assets/illustrations';

type FieldType = {
  email: string;
};

export default function ResetPasswordRequestPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [isPending, startTransition] = useTransition();
  const [isSuccessfulRequest, setIsSuccessfulRequest] =
    useState<boolean>(false);

  const { back } = useRouter();

  const handleSubmit = async (values: FieldType) => {
    const { email } = values;
    try {
      startTransition(async () => {
        const formData = new FormData();

        formData.append('email', email);

        const { data } = await axios.post<{
          success: boolean;
          message?: string;
        }>('/api/auth/reset-password-request', formData);

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

  return (
    <Space direction='vertical' style={{ width: '100%', minHeight: '100vh' }}>
      {contextHolder}
      <Button
        type='default'
        icon={<ArrowLeftOutlined />}
        size='large'
        style={{ justifySelf: 'flex-start', margin: '1em' }}
        onClick={back}
      >
        Volver
      </Button>
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
              ¿Olvidaste tu contraseña?
            </Typography.Paragraph>

            <Alert
              message='Ingresa el email asociado a tu cuenta para recuperar tu contraseña.'
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
                label='Tu email'
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

              <Button
                style={{ marginTop: '1em', marginBottom: '0.75em' }}
                type='primary'
                htmlType='submit'
                block
                loading={isPending}
              >
                Enviar mail de recuperación
              </Button>
            </Form>
          </Space>
        </Card>
      </Flex>
      <SuccessModal
        open={isSuccessfulRequest}
        title='¡Listo!'
        subtitle='Te enviamos un email con instrucciones para recuperar tu contraseña.'
        icon={<MailSentIllustration width='50%' height='auto' />}
        extra={[
          [
            <Link href='/' replace key='return-home' prefetch>
              <Button type='primary' size='large'>
                Volver al inicio
              </Button>
            </Link>,
          ],
        ]}
      />
    </Space>
  );
}
