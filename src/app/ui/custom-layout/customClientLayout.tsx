'use client';

import { Layout } from 'antd';

export const CustomClientLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <Layout>{children}</Layout>;
};
