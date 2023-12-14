import { request } from 'umi';
import type { TableListParams } from './data';

export async function reportPayOrder(params: TableListParams) {
  return request('/api/data/reportPayOrder', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
