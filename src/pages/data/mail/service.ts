import { request_table } from '@/utils/request';
import type { TableListParams } from './data';

export async function getMailList(params: TableListParams) {
  return request_table('/api/data/mail', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function sendMail(params: TableListParams) {
  return request_table('/api/data/mail', {
    method: 'POST',
    data: {
      ...params,
      action: 'add',
    },
  });
}
