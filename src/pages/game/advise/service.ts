import { request_table } from '@/utils/request';
import type { TableListParams } from './data';

export async function getAdviseList(params: TableListParams) {
  return request_table('/api/data/advise', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateAdvise(params: TableListParams) {
  return request_table('/api/data/advise', {
    method: 'POST',
    data: {
      ...params,
      action: 'update',
    },
  });
}
