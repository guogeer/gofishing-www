import { request_table } from '@/utils/request';
import type { TableListParams } from './data';

export async function getRoomList(params: TableListParams) {
  return request_table('/api/report/game_room', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function exportRoomList(params: TableListParams) {
  return request_table('/api/report/game_room', {
    method: 'POST',
    data: {
      ...params,
      action: 'export',
    },
  });
}
