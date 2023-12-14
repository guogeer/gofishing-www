import { request_table } from '@/utils/request';
import type { TableListParams } from './data';

export async function getPayUserList(params: TableListParams) {
  return request_table('/api/data/pay_user', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function exportPayUserList(params: TableListParams) {
  return request_table('/api/data/pay_user', {
    method: 'POST',
    data: {
      ...params,
      action: 'export',
    },
  });
}
