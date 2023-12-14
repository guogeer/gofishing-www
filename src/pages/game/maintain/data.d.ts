import type moment from 'moment';

export type Maintain = {
  Time: moment.Moment[] | string[];
  Content: string;
};

export type Config = {
  Name: string;
};
