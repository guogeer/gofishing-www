export type TableListItem = {
  // key: number;
  disabled?: boolean;
  id?: number;
  chan_id: string;
  version?: string;
  update_type: string;
  whitelist: string;
  blacklist?: string;
  title: string;
  changle_log: string;
  url: string;
  update_time: string;
  json_value: Record<string, string> | string;
  config: string;
};

export type TableListParams = {
  pageSize: number;
  current: number;
  action: string;
  item: TableListItem;
} & TableListItem;
