// https://umijs.org/config/
import { defineConfig } from 'umi';
import darkTheme from '@ant-design/dark-theme';

export default defineConfig({
  antd: {
    dark: true,
  },
  plugins: [
    // https://github.com/zthxxx/react-dev-inspector
    'react-dev-inspector/plugins/umi/react-inspector',
  ],
  locale: {
    default: 'zh-cn',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  theme: {
    ...darkTheme,
    'root-entry-name': 'variable',
  },
  // https://github.com/zthxxx/react-dev-inspector#inspector-loader-props
  inspectorConfig: {
    exclude: [],
    babelPlugins: [],
    babelOptions: {},
  },
});
