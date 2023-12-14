export type TableListItem = {
  key: string;
  rowid: number;
  Row: string[];
};

export type TableListParams = {
  Name: string;
  Table: string[][];
};

export type ConfigTable = {
  // RowHeaders: string[];
  // ColHeaders: string[];
  // ColNames: string[];
  Table: string[][];
  Rows: TableListItem[];
};
