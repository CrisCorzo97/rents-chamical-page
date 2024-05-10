import { CheckCircleFilled } from '@ant-design/icons';
import { Modal, Result } from 'antd';
import { FC } from 'react';

type SuccessModalProps = {
  open: boolean;
  title?: string;
  subtitle?: string;
  extra?: React.ReactNode[];
  icon?: React.ReactNode;
};

export const SuccessModal: FC<SuccessModalProps> = ({
  title,
  subtitle,
  open,
  extra,
  icon,
}) => {
  return (
    <Modal footer={null} open={open} closeIcon={false}>
      <Result icon={icon} title={title} subTitle={subtitle} extra={extra} />
    </Modal>
  );
};
