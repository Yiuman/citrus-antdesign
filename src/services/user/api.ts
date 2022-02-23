import type { MenuDataItem } from '@ant-design/pro-layout';
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

//断言父节点
function assertParentId(item: API.Resource, parentId: string | undefined) {
  if (!parentId) {
    return item.parentId === null || item.parentId === undefined;
  } else {
    return item.parentId === parentId;
  }
}

const listToTree = (
  resources: API.Resource[],
  menuDataItems: MenuDataItem[],
  parentId: string | undefined,
): void => {
  resources.forEach((item) => {
    // 判断是否为父级菜单
    if (assertParentId(item, parentId)) {
      const child = {
        ...item,
        key: item.id || item.resourceId,
        path: item.path ? `/crud/${item.id || item.resourceId}?type=${item.component}` : undefined,
        name: item.resourceName,
        uri: item.path,
        routes: [],
        parentKeys: [parentId ? parentId : ''],
      };
      listToTree(resources, child.routes, item.id);
      menuDataItems.push(child);
    }
  });
};

export const getUserMenus = (currentUser: API.User | undefined): MenuDataItem[] => {
  const menuDataItems: MenuDataItem[] = [];
  if (currentUser && currentUser.menus) {
    listToTree(currentUser.menus || [], menuDataItems, undefined);
  }

  return menuDataItems;
};
