import { CheckCircleFilled } from '@ant-design/icons';
import { Button, Modal, Result } from 'antd';
import Link from 'next/link';
import { FC } from 'react';

type SuccessModalProps = {
  open: boolean;
  onClose: () => void;
};

export const SuccessRegistrationRequestModal: FC<SuccessModalProps> = ({
  open,
  onClose,
}) => {
  return (
    <Modal footer={null} open={open}>
      <Result
        icon={<CheckCircleFilled style={{ color: '5ba02e' }} />}
        title='¡Solicitud enviada con éxito!'
        subTitle='En las próximas 48 horas hábiles, recibirás un correo electrónico informando el estado de la misma.'
        extra={[
          <Button key='try-again' size='large' onClick={onClose}>
            Realizar otra solicitud
          </Button>,
          <Link href='/' replace key='return-home'>
            <Button type='primary' size='large'>
              Volver al inicio
            </Button>
          </Link>,
        ]}
      />
    </Modal>
  );
};
