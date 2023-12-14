export type TableListItem = {
  key: number;
  id?: number;
};

export type ItemConfig = {
  ShopID: number;
  ShopTitle: string;
};

export type WayConfig = {
  Way: string;
  Title: string;
};

export type TableListParams = {
  current: number;
  pageSize: number;
  total: number;

  way: string;
  itemId: number;
  deadline: string[];
};

export type InitParams = {
  Ways: WayConfig[];
  Items: ItemConfig[];
  Chans: Record<string, string>;
  FormVars: any;
};
