import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig } from 'umi';
import { history } from 'umi';
import RightContent from '@/components/RightContent';

import type { RequestConfig } from 'umi';
import type { RequestOptionsInit } from 'umi-request';
import { getUserMenus, getUserOnlineInfo } from './services/user/api';
const loginPath = '/user/login';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.User;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.User | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      return await getUserOnlineInfo();
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果是登录页面，不执行
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: {},
    };
  }
  return {
    fetchUserInfo,
    settings: {},
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    ...initialState?.settings,
    menuDataRender: () => {
      return getUserMenus(initialState?.currentUser);
    },
    iconfontUrl: '//at.alicdn.com/t/font_3199672_bgrlzwb1z5l.js',
  };
};

//添加token头
const tokenHeaderInterceptor = (url: string, options: RequestOptionsInit) => {
  const token = `Bearer ${localStorage.getItem('token') as string}`;
  return {
    url,
    options: {
      ...options,
      interceptors: true,
      headers: { ...options.headers, Authorization: token },
    },
  };
};

const responseDestructionInterceptor = async (response: Response) => {
  const result = await response.clone().json();
  if (result.code !== 0) {
    throw new Error(result.message);
  }
  return { ...result.data, success: 'ok' };
};

export const request: RequestConfig = {
  requestInterceptors: [tokenHeaderInterceptor],
  responseInterceptors: [responseDestructionInterceptor],
};
