import { Toaster } from '@/components/ui/toaster';
import StyledComponentsRegistry from '@/lib/ant-design/AntdRegistry';
import theme from '@/theme/themeConfig';
import { Analytics } from '@vercel/analytics/react';
import { ConfigProvider } from 'antd';
import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import './globals.css';

const poppins = Open_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-open-sans',
});

export const metadata: Metadata = {
  title: 'Rentas Digital',
  description: 'Rentas Municipal de Chamical',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='es'>
      <body className={`${poppins.variable} font-sans`}>
        <StyledComponentsRegistry>
          <ConfigProvider theme={theme}>
            {children}
            <Toaster />
          </ConfigProvider>
        </StyledComponentsRegistry>
        <Analytics />
      </body>
    </html>
  );
}
