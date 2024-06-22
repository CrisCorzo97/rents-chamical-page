'use client';
import { registration_request } from '@prisma/client';
import { Button, Popconfirm, Space, Table, Tag, message } from 'antd';
import { ColumnType } from 'antd/es/table';
import { FC, useState, useTransition } from 'react';
import dayjs from 'dayjs';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import { CustomContent } from '@/app/ui';

type DashboardClientPageProps = {
  registrationRequest: registration_request[];
  refetch: () => Promise<registration_request[]>;
  onConfirm: (
    registration_request: registration_request
  ) => Promise<{ success: boolean; message?: string }>;
  onReject: (
    registration_request: registration_request
  ) => Promise<{ success: boolean; message?: string }>;
};

export const DashboardClientPage: FC<DashboardClientPageProps> = ({
  registrationRequest,
  refetch,
  onConfirm,
  onReject,
}) => {
  const [regReqs, setRegReqs] =
    useState<registration_request[]>(registrationRequest);
  const [isPending, startTransition] = useTransition();

  const onConfirmHandler = async (
    registration_request: registration_request
  ) => {
    const res = await onConfirm(registration_request);

    if (!res.success) {
      message.error(res.message ?? 'error');
    }

    startTransition(async () => {
      const newData = await refetch();

      setRegReqs(newData);
    });
  };

  const onRejectHandler = async (
    registration_request: registration_request
  ) => {
    const res = await onReject(registration_request);

    if (!res.success) {
      message.error(res.message ?? 'error');
    }

    startTransition(async () => {
      const newData = await refetch();

      setRegReqs(newData);
    });
  };

  const columns: ColumnType<registration_request>[] = [
    {
      title: 'Nombre',
      dataIndex: 'first_name',
      key: 'name',
      render: (_, record) => `${record.first_name} ${record.last_name}`,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Fecha de solicitud',
      dataIndex: 'created_at',
      key: 'requested_at',
      render: (created_at) => dayjs(created_at).format('DD/MM/YYYY HH:mm:ss'),
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        switch (status) {
          case 'pending':
            return <Tag color='orange'>Pendiente</Tag>;
          case 'approved':
            return <Tag color='green'>Aprobado</Tag>;
          case 'rejected':
            return <Tag color='red'>Rechazado</Tag>;
          default:
            return <Tag color='gray'>Desconocido</Tag>;
        }
      },
    },
    {
      title: 'Acciones',
      dataIndex: 'actions',
      key: 'actions',
      render: (_, record) => {
        return (
          <Space
            size='middle'
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <Popconfirm
              title='¿Estás seguro de aprobar esta solicitud?'
              okText='Sí'
              cancelText='No'
              onConfirm={() => onConfirmHandler(record)}
            >
              <Button
                size='large'
                type='text'
                shape='circle'
                icon={
                  <CheckCircleTwoTone
                    twoToneColor='#52c41a'
                    style={{ fontSize: '26px' }}
                  />
                }
              />
            </Popconfirm>
            <Popconfirm
              title='¿Estás seguro de rechazar esta solicitud?'
              okText='Sí'
              cancelText='No'
              onConfirm={() => onRejectHandler(record)}
            >
              <Button
                size='large'
                shape='circle'
                type='text'
                icon={
                  <CloseCircleTwoTone
                    twoToneColor='#ff4d4f'
                    style={{ fontSize: '26px' }}
                  />
                }
              />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <CustomContent style={{ maxWidth: '1024px' }}>
      <Table
        columns={columns}
        dataSource={regReqs}
        pagination={false}
        rowKey='id'
        loading={isPending}
      />
    </CustomContent>
  );
};
