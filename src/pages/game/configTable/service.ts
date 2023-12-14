import { request_table } from '@/utils/request';
import type { TableListParams } from './data';

export async function getConfigTable(params: TableListParams) {
  return request_table('/api/system/configTable', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateConfigTable(params: TableListParams) {
  return request_table('/api/system/configTable', {
    method: 'POST',
    data: {
      ...params,
      action: 'update',
    },
  });
}
