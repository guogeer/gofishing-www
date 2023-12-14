import { request_table } from '@/utils/request';
import type { TableListParams } from './data';

export async function getItemLog(params: TableListParams) {
  return request_table('/api/report/item_log', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function exportItemLog(params: TableListParams) {
  return request_table('/api/report/item_log', {
    method: 'POST',
    data: {
      ...params,
      action: 'export',
    },
  });
}
