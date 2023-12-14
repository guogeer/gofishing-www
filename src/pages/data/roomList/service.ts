import { request_table } from '@/utils/request';
import type { TableListParams } from './data';

export async function getRoomList(params: TableListParams) {
  return request_table('/api/data/roomList', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
