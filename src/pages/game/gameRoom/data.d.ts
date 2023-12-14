export type TableListItem = {
  // key: number;
  disabled?: boolean;
  id?: number;
};

export type TableListParams = {
  pageSize: number;
  current: number;
  action: string;
  item: TableListItem;
} & TableListItem;
