export type TableListItem = {
  // key: number;
  disabled?: boolean;
  id?: number;
  bundle_name: string;
  version?: string;
  json_value: Record<string, string> | string;
};

export type TableListParams = {
  pageSize: number;
  current: number;
  action: string;
  item: TableListItem;
} & TableListItem;
