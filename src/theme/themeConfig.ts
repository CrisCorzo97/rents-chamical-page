import type { ThemeConfig } from 'antd';

const theme: ThemeConfig = {
  token: {
    colorPrimary: '#f02389',
    fontSize: 16,
    borderRadius: 8,
    wireframe: false,
    colorError: '#f5222d',
    colorWarning: '#fa8c16',
    colorInfo: '#f02389',
  },
  components: {
    Breadcrumb: {
      colorText: 'rgb(5, 157, 214)',
      colorBgTextHover: 'rgba(0, 123, 176, 0.05)',
      iconFontSize: 16,
      separatorMargin: 6,
    },
    Anchor: {
      colorSplit: 'rgba(240, 35, 137, 0.4)',
    },
    Divider: {
      colorText: 'rgb(0, 123, 176)',
    },
    Button: {
      colorLink: 'rgb(5, 157, 214)',
      colorLinkHover: 'rgb(81, 208, 240)',
      colorLinkActive: 'rgb(0, 123, 176)',
      colorError: 'rgb(245, 34, 45)',
      colorErrorHover: 'rgb(255, 77, 79)',
      colorErrorBorderHover: 'rgb(255, 77, 79)',
      colorErrorActive: 'rgb(207, 19, 34)',
      colorErrorOutline: 'rgba(245, 34, 45, 0.05)',
      colorErrorBg: 'rgba(255, 77, 79, 0.1)',
    },
    Dropdown: {
      colorError: 'rgb(245, 34, 45)',
    },
    Menu: {
      colorError: 'rgb(245, 34, 45)',
    },
    Pagination: {
      colorPrimary: 'rgb(5, 157, 214)',
      colorPrimaryBorder: 'rgb(5, 157, 214)',
      colorPrimaryHover: 'rgb(81, 208, 240)',
    },
    Cascader: {
      optionSelectedBg: 'rgba(81, 208, 240, 0.15)',
      colorHighlight: 'rgb(0, 123, 176)',
    },
    Input: {
      colorFillAlter: 'rgb(255, 161, 198)',
    },
    Card: {
      colorFillAlter: 'rgba(81, 208, 240, 0.1)',
    },
    Collapse: {
      colorFillAlter: 'rgba(81, 208, 240, 0.1)',
    },
    Descriptions: {
      colorFillAlter: 'rgba(81, 208, 240, 0.1)',
    },
    Table: {
      colorPrimary: 'rgb(0, 123, 176)',
    },
    Alert: {
      colorInfo: 'rgb(22, 119, 255)',
      colorInfoBg: 'rgba(22, 119, 255, 0.1)',
      colorInfoBorder: 'rgb(22, 119, 255)',
    },
    Message: {
      colorInfo: 'rgb(22, 119, 255)',
    },
    Notification: {
      colorInfo: 'rgb(22, 119, 255)',
    },
    Progress: {
      colorInfo: 'rgb(5, 157, 214)',
    },
    Result: {
      colorInfo: 'rgb(22, 119, 255)',
    },
  },
  algorithm: [],
};

export default theme;
