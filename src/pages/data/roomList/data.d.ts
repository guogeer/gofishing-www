export type Item = {
  Id: number;
  Num?: number;
};
export type TableListItem = {
  key: number;
  id?: number;
  cper1: number;
  cper2: number;
  cper4: number;
  cper8: number;
  sper0: number;
  sper1: number;
  sper2: number;
  sper3: number;
  spern: number;
  bingo_percent: number;
  bingo_before_relife_percent: number;
  curdate: string[] | moment.Moment[];
};

export type TableListParams = {
  outpost_id: number;
};
