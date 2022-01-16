import { Settings as LayoutSettings } from '@ant-design/pro-layout';
const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'realDark',
  splitMenus: false,
  // 拂晓蓝
  primaryColor: '#1890ff',
  headerHeight: 48,
  layout: 'mix',
  menu: {
    locale: false,
  },
  contentWidth: 'Fluid',
  fixedHeader: true,
  fixSiderbar: true,
  colorWeak: false,
  title: 'Nightfish',
  pwa: false,
  logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
  iconfontUrl: '',
  footerRender: false,
};

export default Settings;
