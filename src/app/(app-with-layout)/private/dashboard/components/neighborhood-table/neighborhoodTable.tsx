'use client';

import { Envelope } from '@/types/envelope';
import { neighborhood } from '@prisma/client';
import { Card, Table } from 'antd';

export type NeighborhoodTableProps = {
  data: Envelope<neighborhood[]>;
};

export const NeighborhoodTable = ({ data }: NeighborhoodTableProps) => {
  const columns = [
    {
      key: 'name',
      dataIndex: 'name',
      title: 'Barrio',
    },
  ];

  return (
    <Card title='Barrios'>
      <Table
        columns={columns}
        dataSource={data.data ?? []}
        pagination={false}
        rowKey={(record) => record.id}
      />
    </Card>
  );
};
