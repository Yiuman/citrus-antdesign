// @ts-ignore
/* eslint-disable */

declare namespace API {
  type LoginForm = {
    username?: string;
    password?: string;
    loginType?: string;
  };

  type LoginVM = {
    loginId?: string;
    password?: string;
    mode?: string;
  };

  type Token = {
    token: string;
    expireTimestamp: number;
    extension?: { [key: string]: any };
  };

  type Resource = {
    id: string;
    resourceName: string;
    resourceId: string;
    type: number;
    resourceCode: string | never;
    parentId: string | never;
    hidden: boolean;
    leaf: boolean | never;
    children: Resource[] | never;
    component: string | never;
    icon: string | never;
    path: string | never;
  };

  type User = {
    uuid: string;
    username?: string;
    login?: string;
    mobile?: string;
    email?: string;
    admin?: boolean;
    avatar?: string;
    status?: number;
    version?: number;
    menus?: Resource[];
    unreadCount: number | undefined;
  };
}
