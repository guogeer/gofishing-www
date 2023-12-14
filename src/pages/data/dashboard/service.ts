import { request } from 'umi';
import type { TableListParams } from './data';

export async function getItemList(params: TableListParams) {
  return request('/api/data/online', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
