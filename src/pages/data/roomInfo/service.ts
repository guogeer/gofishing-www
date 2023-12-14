import { request_table } from '@/utils/request';
import type { TableListParams } from './data';

export async function getRoomInfo(params: TableListParams) {
  return request_table('/api/data/room', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
