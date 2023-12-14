export type TableListItem = {
  // key: number;
  disabled?: boolean;
  id?: number;
  AddNum: number;
  Times: number;
  UserNum: number;
  CoverPer: number;
  AvgTimes: number;
  AvgNum: number;
};

export type TableListParams = {
  action?: string;
  itemId: number;
  curdate: string[];
};

export type TableListData = {
  Dates: string[];
  SumData: TableListItem[];
  data: TableListItem[];
  pagination: {
    current?: number;
    pageSize?: number;
    total?: number;
  };
};
