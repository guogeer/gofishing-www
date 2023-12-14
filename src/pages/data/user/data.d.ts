export type Item = {
  Id: number;
  Num?: number;
};

export type TableListItem = {
  snapshot?: {
    Info: {
      MaxOutpostId: number; // 最大关卡
      Level: number; // 经验等级
      VIP: number; // VI等级
    };
    Audit: {
      CardNum: number;
      BingoNum: number;
      Play: number; // 对局次数
      LastItemWay: string;
      Pay: number; // 付费金额
      play: number; // 对局次数
    };
    LastPayTime?: string; // 上次付款时间
    LastEnterTime?: stirng; // 上次进入游戏
    LastLeaveTime?: string; // 上次离开游戏
    DaubAlertsTs?: number; // Daub Alerts结束时间
  };
  super_power: string | number;
  bingo: string | number;
  exchange_price: string | number;
  count_price: string | number;
  rmb: string | number;
  result: any;
  pay_sdk: string | number;
  key?: number;
  id?: number;
  uid: number;
  nickname: string;
  chan_id: string;
  ip: string;
  create_time: string;
  imei: string;
  imsi: string;
  idfa: string;
  open_id: string;
  items: Item[];
  game_name: string;
  all_open_id: string[];
  bone: number;
  pay_time: string;
};

export type TableListParams = {
  item: TableListItem;
  sorter?: Record<string, string>;
};

export type RewardParams = {
  items: Record<string, string>;
  uid: number;
};
