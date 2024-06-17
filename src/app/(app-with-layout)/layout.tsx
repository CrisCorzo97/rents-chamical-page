'use client';
import { Layout } from 'antd';
import { CustomContent, CustomHeader } from '../ui';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout>
      <CustomHeader />
      <CustomContent>{children}</CustomContent>
    </Layout>
  );
}
