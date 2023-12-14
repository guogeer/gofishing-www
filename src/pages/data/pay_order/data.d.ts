export type TableListItem = {
  key: number;
  id?: number;
  order_id: string;
  buy_uid: number;
  chan_id: string;
  item_id: number;
  exchange_price: number;
  count_price: number;
  rmb: number;
  pay_sdk: string;
  result: number;
  create_time: string | moment.Moment[] | string[];
};

export type TableListParams = {
  local_bills: string[];
  total_count_price: string;
  total_rmb: string;

  current: number;
  pageSize: number;
  total: number;
} & TableListItem;
