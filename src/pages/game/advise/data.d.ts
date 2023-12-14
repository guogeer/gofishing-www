export type TableListItem = {
  key?: number;
  id?: number;
  result: string;
  Title?: string;
  Body?: string;
};

export type MailTemplate = {
  Title: string;
  Body: string;
};

export type TableListParams = {
  item: TableListItem;
  pageSize?: number;
  current?: number;
  result?: string;
};
