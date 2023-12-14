// src/access.ts
export default function access(initialState: { currentUser?: API.CurrentUser | undefined }) {
  const { currentUser } = initialState || {};

  // 权限规则
  // 1、账号admin可以访问全部页面
  // 2、除admin只能访问分配的页面
  let isAccess: boolean = false;
  if (currentUser?.name === 'admin') {
    isAccess = true;
  }
  currentUser?.menus?.forEach((menu) => {
    if (menu === window.location.pathname) {
      isAccess = true;
    }
  });

  return {
    canAdmin: currentUser && currentUser.access === 'admin',
    canAccess: isAccess,
  };
}
