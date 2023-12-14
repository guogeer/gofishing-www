export type Item = {
  Id: number;
  Num?: number;
};
export type TableListItem = {
  key: number;
  id?: number;
  recv_id: number | string | number[];
  Title: string;
  Body: string;
  Items?: Item[] | string;
  status: number;
  send_time: string;
  EffectTime: string[] | moment.Moment[];
  RegTime: string[] | moment.Moment[];
};

export type TableListParams = {
  item: TableListItem;
};
