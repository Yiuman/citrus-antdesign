import { request } from 'umi';
import createCRUD from '../crud';

/**
 * 获取当前的用户信息
 * @returns
 */
export async function getUserOnlineInfo() {
  return request<API.User>('/rest/users/current', { method: 'GET' });
}

/**
 * 登录接口
 * @param userLogin 用户登录
 * @returns
 */
export async function login(userLogin: API.LoginVM) {
  userLogin.mode = userLogin.mode || 'password';
  return request<API.Token>('/rest/authenticate', { method: 'POST', data: userLogin });
}

/**
 * 登出
 * @returns void
 */
export async function logout() {
  return request<void>('/rest/logout', { method: 'POST' });
}

export const userCRUD = createCRUD<API.User, string>('/rest/users');
