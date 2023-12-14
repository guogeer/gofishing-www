import { IRoute } from 'umi';

export default [
  {
    path: '/user/login',
    // hideInMenu: true,
    layout: false,
    component: './user/login',
  },
  {
    name: '权限管理',
    path: '/authority',
    routes: [
      {
        name: '用户列表',
        path: '/authority/user',
        component: './authority/user',
      },
    ],
  },
  {
    name: '数据中心',
    path: '/data',
    routes: [
      {
        path: '/data/day',
        name: '日常数据',
        component: './data/day',
      },
      {
        path: '/data/channel',
        name: '渠道数据',
        component: './data/channel',
      },
      {
        path: '/data/dashboard',
        name: '数据面板',
        component: './data/dashboard',
      },
      {
        path: '/data/pay_order',
        name: '付费订单',
        component: './data/pay_order',
      },
      {
        path: '/data/shop',
        name: '商城统计',
        component: './data/shop',
      },
      {
        path: '/data/user',
        name: '玩家数据',
        component: './data/user',
      },
      {
        path: '/data/itemLog',
        name: '物品日志',
        component: './data/itemLog',
      },
      {
        path: '/data/realTime',
        name: '实时数据',
        component: './data/realTime',
      },
      {
        path: '/data/payUser',
        name: '大R信息',
        component: './data/payUser',
      },
    ],
  },
  {
    path: '/system',
    name: '管理中心',
    routes: [
      {
        path: '/system/mail',
        name: '邮件列表',
        component: './data/mail',
      },
      {
        path: '/system/clientVersion',
        name: '版本历史',
        component: './data/clientVersion',
      },
      {
        path: '/system/clientBundle',
        name: '分包管理',
        component: './game/clientBundle',
      },
      {
        path: '/system/advise',
        name: '玩家反馈',
        component: './game/advise',
      },
      {
        path: '/system/maintain',
        name: '停机维护',
        component: './game/maintain',
      },
    ],
  },
  {
    path: '/configTable',
    name: '配置表',
    routes: [
      {
        path: '/configTable/config',
        name: '常用配置',
        component: './game/configTable',
      },
    ],
  },
  {
    path: '/',
    name: '主界面',
    hideInMenu: true,
    routes: [
      {
        path: '/welcome',
        name: '欢迎',
        icon: 'smile',
        component: './Welcome',
      },
      {
        path: '/',
        name: '数据面板',
        component: './data/dashboard',
      },
    ],
  },
  {
    hideInMenu: true,
    component: './404',
  },
] as IRoute[];
