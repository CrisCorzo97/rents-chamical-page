import { Toaster } from '@/components/ui/toaster';
import StyledComponentsRegistry from '@/lib/ant-design/AntdRegistry';
import theme from '@/theme/themeConfig';
import { Analytics } from '@vercel/analytics/react';
import { ConfigProvider } from 'antd';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Rentas Digital',
  description: 'Rentas Municipal de Chamical',
};

const G_RECAPTCHA_SITE_KEY =
  process.env.G_RECAPTCHA_SITE_KEY ??
  '6LfuwjQqAAAAABoQBWXBvhveIlOKKw5Rpt17xWi2';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='es'>
      <head>
        <Script
          src={`https://www.google.com/recaptcha/enterprise.js?render=${G_RECAPTCHA_SITE_KEY}`}
          async
          defer
        ></Script>
      </head>
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
