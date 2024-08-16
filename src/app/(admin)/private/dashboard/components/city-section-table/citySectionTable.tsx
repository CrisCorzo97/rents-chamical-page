'use client';
import { Envelope } from '@/types/envelope';
import { city_section } from '@prisma/client';
import { Card, Table } from 'antd';

export type CitySectionTableProps = {
  data: Envelope<city_section[]>;
};

export const CitySectionTable = ({ data }: CitySectionTableProps) => {
  const columns = [
    {
      key: 'name',
      dataIndex: 'name',
      title: 'Sección',
    },
  ];

  return (
    <Card title='Secciones de la ciudad'>
      <Table
        columns={columns}
        dataSource={data.data ?? []}
        pagination={false}
        rowKey={(record) => record.id}
      />
    </Card>
  );
};
