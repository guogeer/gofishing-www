export type Item = {
  Id: number;
  Num?: number;
};
export type TableListItem = {
  key: number;
  id?: number;
  pay: number[];
  new_pay: number[];
};

export type TableListParams = {
  curdate: string[][] | moment.Moment[][];
  curdateA: string[] | moment.Moment[];
  curdateB: string[] | moment.Moment[];
  dataType: string;

  data: TableListItem[];
  total: number;
  current: number;
  pageSize: number;
};

export type ChartPoint = {
  dateName: string;
  id: string;
  value: number;
};
