export type TableListItem = {
  key?: number;
  id?: number;
  account: string;
  passwd: string;
  coment: string;
  menus?: string[] | undefined;
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
  å;
  key: number[];
  item: TableListItem;
};
