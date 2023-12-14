/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-plusplus */
import type { IRoute } from 'umi';
import { request } from 'umi';
import routes from '@/../config/routes';
import type { MenuDataItem } from '@ant-design/pro-layout';

// 查询所有菜单
export async function queryMenuTree(): Promise<any> {
  const menus: IRoute[] = routes || [];

  const remoteMenus: MenuDataItem[] = [];
  for (let i = 0; i < menus.length; i++) {
    const children: MenuDataItem[] = [];
    const menu = menus[i] || {};
    const menuRoutes = menu.routes || [];
    for (let k = 0; k < menuRoutes.length; k++) {
      const menu2 = menuRoutes[k];
      if (!menu2.hideInMenu) {
        children.push({ name: menu2.name, path: menu2.path || '', hideInMenu: !!menu2.hideInMenu });
      }
    }
    if (children.length > 0 && !menu.hideInMenu) {
      remoteMenus.push({
        name: menu.name,
        path: menu.path || '',
        icon: menu.icon,
        children,
        hideInMenu: !!menu.hideInMenu,
      });
    }
  }

  return remoteMenus;
}

export async function queryGroup(): Promise<any> {
  return request('/api/user/currentGroup');
}
