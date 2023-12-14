export type RealTimeHour = {
  OnlineNum: number;
  PayNum: number;
};
export type TableListItem = {
  key?: number;
  id?: number;
  Hours?: RealTimeHour;
};

export type TableListParams = {
  pageSize: number;
  total?: number;
  current: number;
} & TableListItem;

export type ChartPoint = {
  hour: number;
  online: number;
  pay: number;
};
