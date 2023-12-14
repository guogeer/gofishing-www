import { request_table } from '@/utils/request';
import type { TableListParams } from './data';

export async function getItemList(params: TableListParams) {
  return request_table('/api/data/chanList', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
