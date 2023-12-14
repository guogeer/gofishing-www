export type TableListItem = {
  key: string;
  curdate: number;
  new_user: number;
  play_times?: number;
  active_user: number;
  pay_user: number;
  first_pay_user: number;
  new_pay_user: number;
  new_pay_rmb: number;
  new_pay_rate: number;
  old_pay_user: number;
  old_pay_rmb: number;
  pay_rmb: number;
  active_arpu: number;
  pay_arpu: number;
};

export type TableListPagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type TableListData = {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
};

export type TableListParams = {
  pageSize: number;
  current: number;
  action: string;
  Date: string[];
  TotalNewUser: number;
  TotalPlayTimes: number;
  TotalActiveUser: number;
  TotalPayUser: number;
  TotalFirstPayUser: number;
  TotalNewPayUser: number;
  TotalNewPayRmb: number;
  TotalNewPayRate: number;
  TotalOldPayUser: number;
  TotalOldPayRmb: number;
  TotalPayRmb: number;
  TotalActiveARPU: number;
  TotalPayARPU: number;
  // 看广告
  TotalActiveWatchAdPer: number;
  TotalActiveWatchAdAvg: number;
  TotalWatchAdUser: number;
  TotalWatchAdNum: number;

  data: TableListItem[];
};
