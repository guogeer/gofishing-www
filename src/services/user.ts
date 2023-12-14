import type { MenuDataItem } from '@ant-design/pro-layout';
import { request } from 'umi';
import { queryMenuTree } from './menu';

export async function query() {
  return request<API.CurrentUser[]>('/api/users');
}

export async function queryCurrent() {
  return request<API.CurrentUser>('/api/user/currentUser');
}

export async function queryUserMenus(user: API.CurrentUser): Promise<any> {
  const menuTree: MenuDataItem[] = await queryMenuTree();

  const menus: Record<string, boolean> = {};
  (user.menus || []).forEach((menu: string) => {
    menus[menu || '/'] = true;
  });
  for (let i = 0; menuTree && i < menuTree.length; i += 1) {
    const children = menuTree[i].children || [];

    let hide: boolean = true;
    for (let j = 0; j < children.length; j += 1) {
      // admin账号具有所有页面的权限
      children[j].hideInMenu = !menus[children[j].path || ''] && user.name !== 'admin';
      if (!children[j].hideInMenu) {
        hide = false;
      }
    }
    if (hide) {
      menuTree[i].hideInMenu = true;
    }
  }

  return menuTree;
}

export async function queryNotices(): Promise<any> {
  return request<{ data: API.NoticeIconData[] }>('/api/notices');
}
