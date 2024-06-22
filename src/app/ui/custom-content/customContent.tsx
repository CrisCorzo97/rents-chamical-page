'use client';
import { Layout } from 'antd';
import { CSSProperties } from 'react';

const { Content } = Layout;

const contentStyles = {
  minHeight: 'calc(100vh - 64px)',
  width: '100%',
  margin: '0 auto',
};

export const CustomContent = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: CSSProperties;
}) => {
  return <Content style={{ ...contentStyles, ...style }}>{children}</Content>;
};
