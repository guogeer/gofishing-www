import { request_table } from '@/utils/request';
import type { TableListParams } from './data';

export async function getOrderList(input: TableListParams) {
  const params = input;
  return request_table('/api/data/payOrder', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function exportOrders(input: TableListParams) {
  const params = input;
  return request_table('/api/data/payOrder', {
    method: 'POST',
    data: {
      action: 'export',
      ...params,
    },
  });
}
