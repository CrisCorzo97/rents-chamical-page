'use client';
import { ContextProvider } from '@/context/contextProvider';
import { CustomHeader, CustomContent } from '@/app/ui';
import { Layout } from 'antd';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ContextProvider>
      <Layout>
        <CustomHeader />
        <CustomContent>{children}</CustomContent>
      </Layout>
    </ContextProvider>
  );
}
