import { Layout } from 'antd';

const { Content } = Layout;

const contentStyles = {
  minHeight: 'calc(100vh - 64px)',
  padding: '0 1em',
  width: '100%',
};

export const CustomContent = ({ children }: { children: React.ReactNode }) => {
  return <Content style={contentStyles}>{children}</Content>;
};
