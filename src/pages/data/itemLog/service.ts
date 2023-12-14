import { request_table } from '@/utils/request';
import type { TableListParams } from './data';

export async function getItemLogList(input: TableListParams) {
  const params = input;

  return request_table('/api/data/itemLog', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function exportItemLog(input: TableListParams) {
  const params = input;

  return request_table('/api/data/itemLog', {
    method: 'POST',
    data: {
      ...params,
      action: 'export',
    },
  });
}
