'use client';
import { UserOutlined } from '@ant-design/icons';
import { Button, Typography } from 'antd';
import Link from 'next/link';

export default function Home() {
  return (
    <Typography.Title level={1}>
      <UserOutlined /> Welcome to the app!
      <Link href='/private/dashboard'>
        <Button type='primary'>Go to dashboard</Button>
      </Link>
    </Typography.Title>
  );
}
